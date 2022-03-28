import { Redirect } from 'react-router';
import React, { Component } from 'react';
import { FormGroup, FormLabel } from '@material-ui/core';
import { ModalRoot, ModalProvider, ModalConsumer } from '@trendmicro/react-modal';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FileCopyTwoTone from '@material-ui/icons/FileCopyTwoTone';
import Grid from "@material-ui/core/Grid";
import CopyToClipboard from 'react-copy-to-clipboard';
import Modal from 'components/Modal';
import Button from "components/CustomButtons/Button.js";
import GameServer from "Services/GameServer";

class ModalCreateRoom extends Component {
  constructor() {
    super();
    this.state = {
      roomId: 0,
      name: "player1$",
      startGame: 0,
      copied: false,
    };

    this.player1Info$ = GameServer.instance.player1Info$;
    this.startGame$ = GameServer.instance.startGame$;
    this.subject = [];
    this.onCopy = this.onCopy.bind(this);
  }

  async generateRandomNumber() {
    var randomNumber = Math.floor(Math.random() * 100000000) + 1;
    this.setState({ roomId: randomNumber });
    return randomNumber;
  }

  modalCreateRoom = ({ onClose, ...props }) => (
    <Modal
      showCloseButton={false}
      showOverlay={true}
      disableOverlayClick={true}
    >
      <Modal.Header><Modal.Title><b>CREATE ROOM</b></Modal.Title></Modal.Header>
      <Modal.Body>
        <Grid container>
          <Grid item xs={7}>
            <h5><b>Room ID</b>: {this.state.roomId}</h5>
          </Grid>
          <Grid item xs={5}>
            <Tooltip title={this.state.copied ? "Copied." : "Click to copy room id."}>
              <CopyToClipboard text={this.state.roomId} onCopy={this.onCopy}>
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <FileCopyTwoTone />
                </IconButton>
              </CopyToClipboard>
            </Tooltip>
          </Grid>
        </Grid>

        <FormLabel>Message: Waiting for players to join.</FormLabel>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {
          onClose();
          GameServer.instance.leaveRoom(this.state.roomId);
        }}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );

  setupSubcribe() {
    this.subject.push(
      this.startGame$.subscribe({
        next: (data) => {
          this.setState({ startGame: data });
        }
      }),
    );
  }

  componentDidMount() {
    this.setupSubcribe();
  }

  componentWillUnmount() {
    this.subject.forEach(sub => sub.unsubscribe());
  }

  onCopy() {
    this.setState({ copied: true });
  }

  render() {
    if (this.state.startGame === 0)
      return (
        <FormGroup><ModalProvider><ModalRoot /><ModalConsumer>
          {({ openModal }) => {
            const handleClick = (e) => {
              this.generateRandomNumber().then((roomId) =>
                GameServer.instance.createRoom(roomId),
                GameServer.instance.setCurrentName(this.state.name),
                // this.subject.push(this.player1Info$.subscribe({
                //   next: (data) => {
                //     console.log(data)
                //     this.setState({ name: data.name });
                //     GameServer.instance.setCurrentName(data.name);
                //   }
                // })),
                openModal(this.modalCreateRoom),
              )
            }
            return (<Button color="primary" onClick={handleClick}>Create Room</Button>);
          }}
        </ModalConsumer></ModalProvider></FormGroup>
      )

    else {
      return (<Redirect to="/game-find-egg" />);
    }
  }
}

export default ModalCreateRoom;
