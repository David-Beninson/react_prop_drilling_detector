import { usePropsState } from "../context/PropsContext";

export function usePropsActions() {
    const { state, dispatch } = usePropsState();

    const addProp = (nodeId, propName, color = null) => {
        dispatch({ type: "ADD_PROP", payload: { nodeId, propName, color } });
    };

    const removeProp = (nodeId, propName) => {
        dispatch({ type: "REMOVE_PROP", payload: { nodeId, propName } });
    };

    const editProp = (nodeId, oldPropName, newPropName) => {
        dispatch({ type: "EDIT_PROP", payload: { nodeId, oldPropName, newPropName } });
    };

    const changePropColor = (propName, color) => {
        dispatch({ type: "CHANGE_PROP_COLOR", payload: { propName, color } });
    };

    const resetProps = () => {
        dispatch({ type: "RESET_PROPS" });
    };

    return {
        componentProps: state.componentProps,
        propColors: state.propColors,
        addProp,
        removeProp,
        editProp,
        changePropColor,
        resetProps
    };
}
