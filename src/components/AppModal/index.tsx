import {ReactNode} from "react";
import {Modal, TouchableWithoutFeedback, View} from "react-native";

interface AppModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
}

const AppModal = ({isVisible, onClose, children}: AppModalProps) => {
    return (
        <Modal
            visible={isVisible}
            onRequestClose={onClose}
            transparent={true}
            animationType="fade">
            <View style={{flex: 1}}>
                {/* Backdrop layer */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <View
                        style={{flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)"}}
                    />
                </TouchableWithoutFeedback>

                {/* Modal content on top */}
                <View
                    pointerEvents="box-none"
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <View
                        style={{
                            overflow: "hidden",
                        }}>
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AppModal;
