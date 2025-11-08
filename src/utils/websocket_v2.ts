import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    setChatLoading,
    setGameChatMessages,
    setGameChatMessagesRead,
    setGangChatMessages,
    setGangChatMessagesRead,
} from "@redux/actions/chatActions";
import store, {RootState} from "@redux/index";
import axios, {getBaseURL} from "./axios"; // Assuming axios.ts is in the same directory

const CHAT_LIMIT = 30;

enum ChannelTypeV2 {
    GAME = "game",
    GANG = "gang",
}

class ChatWebSocketV2 {
    private gameSocket: WebSocket | null = null;
    private gameChatPath: string | null = null;
    private reconnectAttemptsGame: number = 0;
    private reconnectTimeoutGame: any = null;
    private isConnectingGame: boolean = false;

    private gangSocket: WebSocket | null = null;
    private gangChatPath: string | null = null;
    private reconnectAttemptsGang: number = 0;
    private reconnectTimeoutGang: any = null;
    private isConnectingGang: boolean = false;

    private maxReconnectAttempts: number = 10;

    private getWebSocketURL(): string {
        const apiUrl = getBaseURL();
        const httpBase = apiUrl.replace(/\/api\/$/, "");
        const wsBase = httpBase.replace(/^http/, "ws");
        return `${wsBase}/ws`;
    }

    private _connectChannel(path: string, channelType: ChannelTypeV2): void {
        let socket: WebSocket | null;
        let isConnecting: boolean;
        let storedPath: string | null;

        if (channelType === ChannelTypeV2.GAME) {
            socket = this.gameSocket;
            isConnecting = this.isConnectingGame;
            storedPath = this.gameChatPath;
        } else {
            socket = this.gangSocket;
            isConnecting = this.isConnectingGang;
            storedPath = this.gangChatPath;
        }

        if (!path) {
            console.log(
                `[WS ${channelType}] Path is empty. Attempting to disconnect ${channelType} channel.`,
            );
            if (
                socket &&
                (socket.readyState === WebSocket.OPEN ||
                    socket.readyState === WebSocket.CONNECTING)
            ) {
                socket.close(1000, `${channelType} path became null`);
            }
            if (channelType === ChannelTypeV2.GAME) {
                this.gameSocket = null;
                this.gameChatPath = null;
                clearTimeout(this.reconnectTimeoutGame);
                this.isConnectingGame = false;
                this.reconnectAttemptsGame = 0;
            } else {
                this.gangSocket = null;
                this.gangChatPath = null;
                clearTimeout(this.reconnectTimeoutGang);
                this.isConnectingGang = false;
                this.reconnectAttemptsGang = 0;
            }
            return;
        }

        if (isConnecting) {
            console.log(
                `[WS ${channelType}] Already attempting to connect to ${path}.`,
            );
            return;
        }

        if (
            socket &&
            (socket.readyState === WebSocket.OPEN ||
                socket.readyState === WebSocket.CONNECTING) &&
            storedPath === path
        ) {
            console.log(
                `[WS ${channelType}] Already connected to: ${path}. Fetching messages.`,
            );
            this.fetchMessages(path, channelType);
            return;
        }

        if (channelType === ChannelTypeV2.GAME) {
            this.isConnectingGame = true;
            this.gameChatPath = path;
            if (this.gameSocket) {
                console.log(
                    `[WS ${channelType}] Closing existing game connection before connecting to new path: ${path}.`,
                );
                this.gameSocket.close(
                    1000,
                    `New ${channelType} connection requested`,
                );
            }
            this.gameSocket = null;
            this.reconnectAttemptsGame = 0;
        } else {
            this.isConnectingGang = true;
            this.gangChatPath = path;
            if (this.gangSocket) {
                console.log(
                    `[WS ${channelType}] Closing existing gang connection before connecting to new path: ${path}.`,
                );
                this.gangSocket.close(
                    1000,
                    `New ${channelType} connection requested`,
                );
            }
            this.gangSocket = null;
            this.reconnectAttemptsGang = 0;
        }

        this.fetchMessages(path, channelType);

        this.loadAuthHeaders().then(() => {
            const url = `${this.getWebSocketURL()}?chatPath=${encodeURIComponent(
                path,
            )}`;
            console.log(
                `[WS ${channelType}] Connecting to WebSocket at: ${url}`,
            );

            try {
                const newSocket = new WebSocket(url);
                newSocket.onopen = () => this._handleOpen(channelType, path);
                newSocket.onmessage = event =>
                    this._handleMessage(event, channelType, path);
                newSocket.onclose = event =>
                    this._handleClose(event, channelType, path);
                newSocket.onerror = error =>
                    this._handleError(error, channelType, path);

                if (channelType === ChannelTypeV2.GAME)
                    this.gameSocket = newSocket;
                else this.gangSocket = newSocket;
            } catch (error) {
                console.error(
                    `[WS ${channelType}] WebSocket connection error to ${path}:`,
                    error,
                );
                if (channelType === ChannelTypeV2.GAME)
                    this.isConnectingGame = false;
                else this.isConnectingGang = false;
                store.dispatch(setChatLoading(false));
                this._scheduleReconnect(channelType, path);
            }
        });
    }

    connectGameChannel(path: string): void {
        console.log("[WS Game] connectGameChannel called with path:", path);
        this._connectChannel(path, ChannelTypeV2.GAME);
    }

    connectGangChannel(path: string): void {
        console.log("[WS Gang] connectGangChannel called with path:", path);
        // Path can be empty/null to signal disconnection for gang channel
        this._connectChannel(path, ChannelTypeV2.GANG);
    }

    fetchMessages(path: string, channelType: ChannelTypeV2): void {
        if (!path) {
            console.warn(
                `[WS ${channelType}] Attempted to fetch messages for an empty path. Aborting.`,
            );
            store.dispatch(setChatLoading(false));
            return;
        }
        store.dispatch(setChatLoading(true));
        axios
            .get(
                `chat/messages?chatPath=${encodeURIComponent(
                    path,
                )}&limit=${CHAT_LIMIT}`,
            )
            .then(response => {
                const messages = response.data.messages || [];
                if (channelType === ChannelTypeV2.GAME) {
                    store.dispatch(setGameChatMessages(messages));
                } else {
                    store.dispatch(setGangChatMessages(messages));
                }
                store.dispatch(setChatLoading(false));
            })
            .catch(error => {
                console.error(
                    `[WS ${channelType}] Error fetching messages for ${path}:`,
                    error,
                );
                store.dispatch(setChatLoading(false));
            });
    }

    private async loadAuthHeaders(): Promise<Record<string, string>> {
        try {
            const authData = await AsyncStorage.getItem("@authCredentials");
            if (authData) {
                const headers: Record<string, string> = {};
                const credentials = JSON.parse(authData);
                credentials.forEach((item: {key: string; value: string}) => {
                    headers[item.key] = item.value;
                });
                return headers;
            }
        } catch (error) {
            console.error("Error loading auth headers:", error);
        }
        return {};
    }

    private _handleOpen = (channelType: ChannelTypeV2, path: string) => {
        console.log(`[WS ${channelType}] Connection established to ${path}.`);
        if (channelType === ChannelTypeV2.GAME) {
            this.isConnectingGame = false;
            this.reconnectAttemptsGame = 0;
        } else {
            this.isConnectingGang = false;
            this.reconnectAttemptsGang = 0;
        }
    };

    private _handleMessage = (
        event: WebSocketMessageEvent,
        channelType: ChannelTypeV2,
        currentWSPath: string,
    ) => {
        try {
            const data = JSON.parse(event.data as string);
            console.log(
                `[WS ${channelType}] Received message on path ${currentWSPath}:`,
                data,
            );

            this.fetchMessages(currentWSPath, channelType);

            const state = store.getState() as RootState;
            const currentDisplayPath = state.chat.currentChatPath;

            if (channelType === ChannelTypeV2.GAME) {
                if (currentWSPath !== currentDisplayPath) {
                    store.dispatch(setGameChatMessagesRead(false));
                } else {
                    store.dispatch(setGameChatMessagesRead(true));
                }
            } else if (channelType === ChannelTypeV2.GANG) {
                if (currentWSPath !== currentDisplayPath) {
                    store.dispatch(setGangChatMessagesRead(false));
                } else {
                    store.dispatch(setGangChatMessagesRead(true));
                }
            }
        } catch (error) {
            console.error(
                `[WS ${channelType}] Error parsing message on path ${currentWSPath}:`,
                error,
            );
        }
    };

    private _handleClose = (
        event: WebSocketCloseEvent,
        channelType: ChannelTypeV2,
        path: string,
    ) => {
        console.log(
            `[WS ${channelType}] Connection closed to ${path}:`,
            event.code,
            event.reason,
        );
        const wasDeliberate = event.code === 1000;

        if (channelType === ChannelTypeV2.GAME) {
            this.isConnectingGame = false;
            if (this.gameSocket === event.target) {
                // Ensure we are cleaning up the correct socket instance
                this.gameSocket = null;
            }
            if (!wasDeliberate && this.gameChatPath) {
                this._scheduleReconnect(ChannelTypeV2.GAME, this.gameChatPath);
            }
        } else {
            this.isConnectingGang = false;
            if (this.gangSocket === event.target) {
                this.gangSocket = null;
            }
            if (!wasDeliberate && this.gangChatPath) {
                this._scheduleReconnect(ChannelTypeV2.GANG, this.gangChatPath);
            }
        }
    };

    private _handleError = (
        error: any,
        channelType: ChannelTypeV2,
        path: string,
    ) => {
        console.error(
            `[WS ${channelType}] Error for path ${path}:`,
            error.message || error,
        );
        // The onclose event will usually follow an error and handle reconnection logic.
        // However, ensure connecting state is reset.
        if (channelType === ChannelTypeV2.GAME) {
            this.isConnectingGame = false;
            // Potentially close and nullify socket here if WebSocket API doesn't guarantee onclose after error
        } else {
            this.isConnectingGang = false;
        }
    };

    private _scheduleReconnect = (
        channelType: ChannelTypeV2,
        path: string | null,
    ) => {
        if (!path) {
            console.log(
                `[WS ${channelType}] Not scheduling reconnect for null path.`,
            );
            return;
        }

        let reconnectAttempts: number;
        let currentInstancePath: string | null;
        let timeoutVar: any;

        if (channelType === ChannelTypeV2.GAME) {
            reconnectAttempts = this.reconnectAttemptsGame;
            currentInstancePath = this.gameChatPath;
            timeoutVar = this.reconnectTimeoutGame;
        } else {
            reconnectAttempts = this.reconnectAttemptsGang;
            currentInstancePath = this.gangChatPath;
            timeoutVar = this.reconnectTimeoutGang;
        }

        if (currentInstancePath !== path) {
            console.log(
                `[WS ${channelType}] Path ${path} is outdated for reconnection. Current path: ${currentInstancePath}. Aborting reconnect.`,
            );
            return;
        }

        if (reconnectAttempts < this.maxReconnectAttempts) {
            const delay = Math.min(
                1000 * Math.pow(1.5, reconnectAttempts),
                30000,
            );
            console.log(
                `[WS ${channelType}] Scheduling reconnect attempt ${
                    reconnectAttempts + 1
                } in ${delay}ms for ${path}`,
            );

            clearTimeout(timeoutVar);
            const newTimeoutId = setTimeout(() => {
                if (channelType === ChannelTypeV2.GAME) {
                    if (this.gameChatPath === path) {
                        // Double check path hasn't changed
                        this.reconnectAttemptsGame++;
                        this._connectChannel(path, ChannelTypeV2.GAME);
                    }
                } else {
                    if (this.gangChatPath === path) {
                        // Double check path hasn't changed
                        this.reconnectAttemptsGang++;
                        this._connectChannel(path, ChannelTypeV2.GANG);
                    }
                }
            }, delay);

            if (channelType === ChannelTypeV2.GAME) {
                this.reconnectTimeoutGame = newTimeoutId;
            } else {
                this.reconnectTimeoutGang = newTimeoutId;
            }
        } else {
            console.warn(
                `[WS ${channelType}] Maximum reconnection attempts reached for ${path}`,
            );
        }
    };

    sendMessage(message: any, targetPath: string): boolean {
        let socketToUse: WebSocket | null = null;
        let channelTypeForLog: string = "";

        if (targetPath === this.gameChatPath && this.gameSocket) {
            socketToUse = this.gameSocket;
            channelTypeForLog = ChannelTypeV2.GAME.toUpperCase();
        } else if (targetPath === this.gangChatPath && this.gangSocket) {
            socketToUse = this.gangSocket;
            channelTypeForLog = ChannelTypeV2.GANG.toUpperCase();
        } else {
            console.warn(
                `[WS Send] No active socket matching targetPath: ${targetPath}. Game path: ${this.gameChatPath}, Gang path: ${this.gangChatPath}`,
            );
            return false;
        }

        if (socketToUse && socketToUse.readyState === WebSocket.OPEN) {
            socketToUse.send(JSON.stringify(message));
            console.log(
                `[WS ${channelTypeForLog}] Message sent to ${targetPath}:`,
                message,
            );
            return true;
        } else {
            console.warn(
                `[WS ${channelTypeForLog}] Socket for ${targetPath} not connected, message not sent. State: ${socketToUse?.readyState}`,
            );
            if (targetPath === this.gameChatPath && !this.isConnectingGame) {
                this._connectChannel(targetPath, ChannelTypeV2.GAME);
            } else if (
                targetPath === this.gangChatPath &&
                !this.isConnectingGang
            ) {
                this._connectChannel(targetPath, ChannelTypeV2.GANG);
            }
            return false;
        }
    }

    disconnect(): void {
        console.log("[WS] Disconnecting all sockets requested by client.");

        clearTimeout(this.reconnectTimeoutGame);
        this.gameChatPath = null; // Clear path to prevent auto-reconnects
        if (this.gameSocket) {
            console.log("[WS Game] Closing connection.");
            this.gameSocket.close(1000, "Client initiated disconnect");
            this.gameSocket = null;
        }
        this.isConnectingGame = false;
        this.reconnectAttemptsGame = 0;

        clearTimeout(this.reconnectTimeoutGang);
        this.gangChatPath = null; // Clear path to prevent auto-reconnects
        if (this.gangSocket) {
            console.log("[WS Gang] Closing connection.");
            this.gangSocket.close(1000, "Client initiated disconnect");
            this.gangSocket = null;
        }
        this.isConnectingGang = false;
        this.reconnectAttemptsGang = 0;
    }
}

export const chatWebSocketV2 = new ChatWebSocketV2();
