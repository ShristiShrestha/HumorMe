import { UserRole, UserRoleStatus } from "./utils/Users";
import { logger } from "firebase-functions";
import { v4 as uuidv4 } from "uuid";

const { firestoreDb } = require("./firebase");

/******************* fetch users ************************/

export type FetchUsersParams = {
    id?: string;
    role?: UserRole;
    roleStatus?: UserRoleStatus;
    createdAfterTs?: Date;
    limit: number;
};

// todo: add createdAfterTs logic
export async function getUsersFromDb(params: FetchUsersParams) {
    const usersCollection = await firestoreDb.collection("users");
    let queryUsers = await usersCollection.where("password", "!=", "");

    if (params.id) queryUsers = queryUsers.where("id", "==", params.id);
    if (params.role) queryUsers = queryUsers.where("role", "==", params.role);
    if (params.roleStatus)
        queryUsers = queryUsers.where("roleStatus", "==", params.roleStatus);
    queryUsers = queryUsers.limit(params.limit);

    const queryUsersSnapshot = await queryUsers.get();
    if (queryUsersSnapshot.empty) return [];

    const usersInDb: any[] = [];

    queryUsersSnapshot.forEach((doc: any) => {
        const userData = doc.data();
        delete userData["password"];
        usersInDb.push(userData);
    });

    return usersInDb;
}

/******************* login and session tracking ************************/

export async function processSignIn(password: string) {
    const usersCollection = await firestoreDb.collection("users");
    const passUserQuery = await usersCollection.where(
        "password",
        "==",
        password,
    );

    const passUserSnapshot = await passUserQuery.get();

    if (passUserSnapshot.empty) return undefined;

    const foundUser = passUserSnapshot.docs[0].data();
    delete foundUser["password"];
    return foundUser;
}

/******************* assign users to role: experiment and control ************************/

export async function assignUserToGroup(userRoleReq?: UserRole) {
    const usersCollection = await firestoreDb.collection("users");

    let assignedUser: any | undefined = undefined;
    let assignedUserRole: any | UserRole = undefined;

    // since there is no specific role asked by the request
    // assign any of the available user randomly
    if (userRoleReq === undefined) {
        const experimentUsersSnapshot = await usersCollection
            .where("role", "==", UserRole.EXPERIMENT)
            .where("roleStatus", "==", UserRoleStatus.AVAILABLE)
            .get();
        const controlUsersSnapshot = await usersCollection
            .where("role", "==", UserRole.CONTROL)
            .where("roleStatus", "==", UserRoleStatus.AVAILABLE)
            .get();

        // No users found available from either group
        if (experimentUsersSnapshot.empty && controlUsersSnapshot.empty)
            return assignedUser;

        // both groups have some users available
        if (!experimentUsersSnapshot.empty && !controlUsersSnapshot.empty) {
            const diffExpToControl =
                experimentUsersSnapshot.docs.length -
                controlUsersSnapshot.docs.length;

            logger.info("diffExpToControl: ", diffExpToControl);

            // if experiment group has more users
            // assign new user to control group
            if (diffExpToControl < 0) {
                assignedUserRole = UserRole.CONTROL;
                assignedUser = controlUsersSnapshot.docs[0];
                logger.info("[USER ASSIGN] more exp so control group: ");
            }
            // if control group has more users
            // assign new user to experiment group
            else {
                assignedUserRole = UserRole.EXPERIMENT;
                assignedUser = experimentUsersSnapshot.docs[0];
                logger.info("[USER ASSIGN] more control so experiment group: ");
            }
        }
        // if only control group has available users
        else if (experimentUsersSnapshot.empty) {
            assignedUserRole = UserRole.CONTROL;
            assignedUser = controlUsersSnapshot.docs[0];
            logger.info("[USER ASSIGN] Only control group: ");
        }
        // if only experiment group has available users
        else if (controlUsersSnapshot.empty) {
            assignedUserRole = UserRole.EXPERIMENT;
            assignedUser = experimentUsersSnapshot.docs[0];
            logger.info("[USER ASSIGN] Only experiment group: ");
        }
    }

    // request provides userRole to assign
    // just assign any of the role user
    // no need to check for availability
    else {
        const userWithRoleSnapshot = await usersCollection
            .where("role", "==", userRoleReq)
            // .where("roleStatus", "==", UserRoleStatus.AVAILABLE)
            .limit(1)
            .get();
        if (!userWithRoleSnapshot.empty) {
            assignedUserRole = userRoleReq;
            assignedUser = userWithRoleSnapshot.docs[0];
        }
    }

    if (assignedUser !== undefined && assignedUserRole !== undefined) {
        const assignedUserRef = assignedUser.ref;
        const assignedUserData = assignedUser.data();

        // assign user, make them unavailable
        // so that other new users are not assigned this user
        await assignedUserRef.update({
            roleStatus: UserRoleStatus.ASSIGNED,
        });

        const updatedAssignedUserSnapshot = await usersCollection
            .where("id", "==", assignedUserData.id)
            .where("password", "==", assignedUserData.password)
            .where("role", "==", assignedUserRole)
            .limit(1)
            .get();

        if (updatedAssignedUserSnapshot.empty) {
            logger.error(
                "User assigned after update not found. Role: ",
                assignedUserRole,
                "\n user info",
                assignedUser,
            );
        }
        return updatedAssignedUserSnapshot.docs[0].data();
    }

    // if we have no user available to assign
    // we create one instead of returning empty-handed
    else {
        const uniqueId = uuidv4()?.toString();
        const newUserDoc = {
            createdAt: new Date(),
            csvCreatedAt: "",
            csvId: "",
            id: uniqueId,
            password: uniqueId?.slice(0, 7),
            role: assignedUserRole || userRoleReq || UserRole.CONTROL,
            roleStatus: UserRoleStatus.ASSIGNED,
        };

        await usersCollection.add(newUserDoc);

        // check if saved properly and returned saved
        const newlyAddedSnapShot = await usersCollection
            .where("id", "==", uniqueId)
            .limit(1)
            .get();

        if (!newlyAddedSnapShot.empty) return newlyAddedSnapShot.docs[0].data();
    }

    return undefined;
}
