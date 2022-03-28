import { BehaviorSubject } from 'rxjs';

export default class GameServer {
    static instance = GameServer.instance || new GameServer()
    constructor() {
        const ENDPOINT = `wss://game-counter-test-heroku.herokuapp.com/games`;
        this.io = require("socket.io-client");
        this.socket = this.io.connect(ENDPOINT, { "transports": ["websocket"] });
        this.currentName = "";
        this.player1Info$ = this._getDataObservable("getPlayer1Info", { name: "player1", score: 0, wrongNumOfTime: 0 });
        this.player2Info$ = this._getDataObservable("getPlayer2Info", { name: "player2", score: 0, wrongNumOfTime: 0 });
        this.startGame$ = this._getDataObservable("startGame", 0);
        this.listEggs$ = this._getDataObservable("getListEggs", []);
    }

    setCurrentName(name) {
        this.currentName = name;
    }

    getCurrentName() {
        return this.currentName;
    }

    getCurrentRoomId() {
        return this.roomId
    }

    createRoom(roomId) {
        if (roomId > 0) {
            this.socket.emit("joinRoom", roomId);
            this.roomId = roomId;
        }
    }

    joinRoom(roomId) {
        if (roomId > 0) {
            this.socket.emit("findRoom", roomId);
            this.roomId = roomId;
        }
    }

    sendClickEvent(room, name, pos) {
        this.socket.emit("clickEvent", room, name, pos);
    }

    leaveRoom(roomId) {
        if (roomId > 0)
            this.socket.emit("leaveRoom", roomId);
    }

    disconnect() {
        this.socket.disconnect();
    }

    _getDataObservable(event, paramInit = []) {
        if (!this.socket) {
            setTimeout(() => {
                return this._getDataObservable(event);
            }, 1000);
        }
        else {
            let bs = new BehaviorSubject(paramInit);
            this.socket.on(event, data => {
                bs.next(data);
            });
            return bs;
        }
    }
}