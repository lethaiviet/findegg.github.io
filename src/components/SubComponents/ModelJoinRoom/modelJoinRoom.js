import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { ModalRoot, ModalProvider, ModalConsumer } from '@trendmicro/react-modal';
import { FormGroup } from '@material-ui/core';
import Modal from 'components/Modal';
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import GameServer from "Services/GameServer";

class ModalJoinRoom extends Component {
  constructor() {
    super();
    this.state = {
      roomId: 0,
      name: "player2$",
      startGame: 0,
    };

    this.updateInput = this.updateInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startGame$ = GameServer.instance.startGame$;
    this.subject = [];
  }

  modalJoinRoom = ({ onClose, ...props }) => (
    <Modal showCloseButton={false} showOverlay={true}>
      <Modal.Header><Modal.Title><b>JOIN ROOM</b></Modal.Title></Modal.Header>
      <Modal.Body>
        <CustomInput
          labelText="Room id"
          id="float"
          formControlProps={{
            fullWidth: true,
            onChange: this.updateInput
          }}
        ></CustomInput>
      </Modal.Body>
      <Modal.Footer>
        <Button btnStyle="primary" onClick={onClose}>Cancel</Button>
        <Button btnStyle="primary" onClick={this.handleSubmit}>Join</Button>
      </Modal.Footer>
    </Modal>
  );

  setupSubcribe() {
    this.subject.push(
      this.startGame$.subscribe({
        next: (data) =>
          this.setState({ startGame: data })
      })
    );
  }

  updateInput(event) {
    this.setState({ roomId: event.target.value })
  }

  componentDidMount() {
    this.setupSubcribe();
  }

  componentWillUnmount() {
    this.subject.forEach(sub => sub.unsubscribe());
  }
  handleSubmit() {
    GameServer.instance.joinRoom(this.state.roomId);
    GameServer.instance.setCurrentName(this.state.name);
  }

  render() {
    if (this.state.startGame === 0)
      return (
        <FormGroup><ModalProvider><ModalRoot /><ModalConsumer>
          {({ openModal }) => {
            const handleClick = (e) => {
              openModal(this.modalJoinRoom)
            }
            return (<Button color="primary" onClick={handleClick}>Join Room</Button>);
          }}
        </ModalConsumer></ModalProvider></FormGroup>
      )
    else {
      return (<Redirect to="/findegg.github.io/game-find-egg" />);
    }
  }
}

export default ModalJoinRoom;
