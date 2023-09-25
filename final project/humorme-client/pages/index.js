import React from "react";
import styled from "styled-components";
import JokesList from "../containers/jokes/JokesList";

/* styled components */
const Wrapper = styled.div.attrs({
    className: "vertical-start-flex",
})`
    height: calc(100vh - 110px);
    padding-top: 24px;
    row-gap: 24px;
    overflow-y: hidden;
`;

export default function Home() {
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     if (loading) {
    //         checkIfAuthExistsCallback();
    //     }
    // }, []);

    // const checkIfAuthExistsCallback = useCallback(() => {
    //     // Add an observer to detect changes in the user's authentication state
    //     firebaseGetAuth.onAuthStateChanged(
    //         authUser => {
    //             if (authUser) {
    //                 // User is signed in
    //                 console.log(
    //                     "[ALREADY LOGGED IN] index.js inside authstate change:",
    //                     authUser,
    //                 );
    //                 dispatch(setAuth(toAuthUser(authUser)));
    //             } else {
    //                 console.log(
    //                     "[ALREADY LOGGED IN] index.js\nNO logged user in authstate change",
    //                 );
    //             }
    //
    //             // stop loading
    //             if (loading) {
    //                 setLoading(false);
    //             }
    //         },
    //         error => {
    //             console.error("[Auth state change] error: ", error);
    //         },
    //         () => {
    //             // Immediately call handleUser with the current user
    //             if (!user) {
    //                 const currentUser = firebaseGetAuth.currentUser;
    //                 if (currentUser) {
    //                     console.log(
    //                         "[ALREADY LOGGED IN] index.js outside authstate change: ",
    //                         currentUser,
    //                     );
    //                     dispatch(setAuth(toAuthUser(currentUser)));
    //                 }
    //             }
    //
    //             // stop loading
    //             if (loading) {
    //                 setLoading(false);
    //             }
    //         },
    //     );
    // }, []);

    // if (loggedIn)
    //     return (
    //         <Wrapper>
    //             <Spin spinning={loading}>
    //                 <JokesList />
    //             </Spin>
    //         </Wrapper>
    //     );

    // return (
    //     <Spin spinning={loading}>
    //         <OAuth />
    //     </Spin>
    // );

    return (
        <Wrapper>
            <JokesList />
        </Wrapper>
    );
}
