import './dashBoard.css';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import styles from "assets/jss/material-dashboard-react/cardImagesStyles.js";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ModalCreateRoom from "components/SubComponents/ModelCreateRoom/modelCreateRoom"
import ModalJoinRoom from "components/SubComponents/ModelJoinRoom/modelJoinRoom"
import imgGame from "assets/image_game/background.jpg";

const useStyles = makeStyles(styles);

function DashBoard() {
  const classes = useStyles();

  return (
    <div className="App">
      <header className="App-header">
        <h3>GAME BY ME</h3>
        <Card style={{ width: "40rem" }}>
          <img
            className={classes.cardImgTop}
            data-src="holder.js/100px180/"
            alt="100%x180"
            style={{ height: "300px", width: "100%", display: "block" }}
            src={imgGame}
            data-holder-rendered="true"
          />
          <CardBody>
            <h4>Game pick the numbers in order</h4>
            <p>Game demo from Cogito team</p>
            <Grid container>
              <Grid item xs={6}>
                <ModalCreateRoom></ModalCreateRoom>
              </Grid>
              <Grid item xs={6}>
                <ModalJoinRoom></ModalJoinRoom>
              </Grid>
            </Grid>
          </CardBody>
        </Card>
      </header>
    </div >
  );
}

export default DashBoard;
