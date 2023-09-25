import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import reducers from "./reducers";
import thunk from "redux-thunk";
import { isInDevelopment } from "../utils/LoggerUtils";

export const combinedReducer = combineReducers({ ...reducers });

export const configureStore = (preLoadedState: any) => {
    /* -------------------------- Middle wares ------------------------ */

    const loggerMiddleware = createLogger();
    const defaultMiddleWares = [thunk];
    const withLoggerMiddleWares = [thunk, loggerMiddleware];
    const middleWares = isInDevelopment
        ? withLoggerMiddleWares
        : defaultMiddleWares;
    const middlewareEnhancer = applyMiddleware(...middleWares);

    /* -------------------------- Enhancers ------------------------ */

    const enhancers = [middlewareEnhancer];
    // @ts-ignore
    const composeEnhancers =
        typeof window === "object" &&
        // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? // @ts-ignore
              window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                  // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
              })
            : compose;
    const composedEnhancers = composeEnhancers(...enhancers);

    /* -------------------------- Creating the main store ------------------------ */

    const rootReducer = (state: any, action: { type: string }) => {
        if (action.type === "RESET_REDUX") {
            const { Language } = state;
            state = { Language };
        }
        return combinedReducer(state, action);
    };

    return createStore(rootReducer, preLoadedState, composedEnhancers);
};

const myStore = configureStore({});

export default myStore;
