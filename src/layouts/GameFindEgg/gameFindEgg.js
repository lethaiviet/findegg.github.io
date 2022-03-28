import React, { useRef } from 'react'
import GameServer from "Services/GameServer";
import Canvas from "components/SubComponents/Canvas/Canvas"
import imgTitleGrass from "assets/image_game/titleGrass.png";
import imgTitleBGTop from "assets/image_game/titleTop.png";
import imgBoxName1 from "assets/image_game/boxName3.png";
import imgBoxName2 from "assets/image_game/boxName2.png";
import imgVictory from "assets/image_game/victory.jpg";
import imgLose from "assets/image_game/lose.jpg";
import { combineLatest } from 'rxjs';
const SCREEN = {
  FULL: {
    height: window.innerHeight,
    width: window.innerWidth
  },
  AREA_GAME: {
    height: 500,
    width: 1200
  }
}

const scoreFont = { "size": 12, "aligne": 20 }
const boxName = { w: 130, hImage: 50, align: 100, hBox: 50, bias: 5 };
const endGameImage = { w: 400, h: 300 };
const styleCanvas = {
  // border: "12px solid #d3d3d3",
  padding: 0,
  margin: "auto",
  display: "block",
  position: "absolute",
  top: 0, bottom: 0, left: 0, right: 0,
}


function renderBalls(context, elements) {
  context.clearRect(0, 0, SCREEN.AREA_GAME.width, SCREEN.AREA_GAME.height);
  elements.forEach(function (element) {
    context.beginPath();
    context.fillStyle = element.colour;
    context.arc(element.cx, element.cy, element.r, 0, 2 * Math.PI);
    context.font = `${element.sizeFont}px Arial`
    const wText = context.measureText(element.text).width;
    const hText = context.measureText('M').width;
    context.fillText(element.text, element.cx - wText / 2, element.cy + hText / 2, wText);
    context.stroke();
  });
}

function GameFindEgg() {
  const listEggs$ = GameServer.instance.listEggs$;
  const player1Info$ = GameServer.instance.player1Info$;
  const player2Info$ = GameServer.instance.player2Info$;
  const namePlayer = GameServer.instance.getCurrentName();
  const currentRoomID = GameServer.instance.getCurrentRoomId();
  const maxNumEgg = 50;

  var canvasAreaGameRef = useRef(null);
  var imgTitleGrassRef = React.createRef();
  var imgTitleBGTopRef = React.createRef();
  var imgBoxName1Ref = React.createRef();
  var imgBoxName2Ref = React.createRef();
  var imgVictoryRef = React.createRef();
  var imgLoseRef = React.createRef();

  const drawAreaGame = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    // listEggs$.subscribe({ next: (data) => renderBalls(ctx, data) });

    const imgVic = imgVictoryRef.current;
    const imgLos = imgLoseRef.current;
    combineLatest([listEggs$, player1Info$, player2Info$])
      .subscribe({
        next: (data) => {
          if (data[0].length === 0 && (data[1] !== 0 || data[2] !== 0)) {
            const P1Inf = data[1];
            const P2Inf = data[2];
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            if ((namePlayer === 'player1$' && P1Inf["score"] > P2Inf["score"])
              || (namePlayer === 'player2$' && P2Inf["score"] > P1Inf["score"])) {
              ctx.drawImage(imgVic,
                (ctx.canvas.width - endGameImage.w) / 2, (ctx.canvas.height - endGameImage.h) / 2,
                endGameImage.w, endGameImage.h);
            } else {
              ctx.drawImage(imgLos,
                (ctx.canvas.width - endGameImage.w) / 2, (ctx.canvas.height - endGameImage.h) / 2,
                endGameImage.w, endGameImage.h);
            }
          } else {
            renderBalls(ctx, data[0])
          }
        }
      });
  }

  const drawBackGround = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const lengthSide = 5;
    const nRepeatXAxis = SCREEN.FULL.width / lengthSide;
    const nRepeatYAxis = SCREEN.FULL.height / lengthSide;
    const img = imgTitleBGTopRef.current;
    img.onload = function () {
      for (var i = 0; i < nRepeatYAxis; i++) {
        for (var j = 0; j < nRepeatXAxis; j++) {
          ctx.drawImage(img,
            j * lengthSide, i * lengthSide,
            lengthSide, lengthSide);
        }
      }
    };
  }

  const drawNamePlayers = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    const imgBoxName1 = imgBoxName1Ref.current;
    imgBoxName1.onload = function () {
      ctx.drawImage(imgBoxName1,
        boxName.align, 0,
        boxName.w, boxName.hImage);
    };

    const imgBoxName2 = imgBoxName2Ref.current;
    imgBoxName2.onload = function () {
      ctx.drawImage(imgBoxName2,
        SCREEN.FULL.width - boxName.w - boxName.align, 0,
        boxName.w, boxName.hImage);
    };
  }

  const drawScore = (ctx, frameCount) => {
    const textNameP1Pos = {
      x: boxName.align + scoreFont.aligne,
      y: boxName.hImage - scoreFont.size / 2 - boxName.bias
    }

    const textNameP2Pos = {
      x: SCREEN.FULL.width - boxName.w - boxName.align + scoreFont.aligne,
      y: textNameP1Pos.y
    }

    const textWantedNumber = {
      x: SCREEN.FULL.width / 2,
      y: textNameP1Pos.y
    }

    listEggs$.subscribe({
      next: (data) => {
        ctx.clearRect(textWantedNumber.x, 0, boxName.w, boxName.hImage);
        const textWanted = maxNumEgg - data.length + 1;
        ctx.font = `30px Arial`;
        ctx.fillText(`${textWanted}`, textWantedNumber.x, textWantedNumber.y);
      }
    });

    combineLatest([player1Info$, player2Info$]).subscribe({
      next: (playerInfo) => {
        ctx.clearRect(textNameP1Pos.x, 0, boxName.w, boxName.hImage);
        ctx.clearRect(textNameP2Pos.x, 0, boxName.w, boxName.hImage);
        ctx.font = `${scoreFont.size}px Arial`;
        ctx.fillText(`${playerInfo[0]["name"]}:${playerInfo[0]["score"]}`, textNameP1Pos.x, textNameP1Pos.y);
        ctx.fillText(`${playerInfo[1]["name"]}:${playerInfo[1]["score"]}`, textNameP2Pos.x, textNameP2Pos.y);
      }
    })
  }

  const handleCanvasAreaGameClick = (event) => {
    const pos = {
      "x": event.clientX - canvasAreaGameRef.canvas.offsetLeft,
      "y": event.clientY - canvasAreaGameRef.canvas.offsetTop
    };
    GameServer.instance.sendClickEvent(currentRoomID, namePlayer, pos);
  }

  return (
    <div>
      <Canvas
        draw={drawBackGround}
        width={SCREEN.FULL.width}
        height={SCREEN.FULL.height}
        style={styleCanvas}
      />
      <Canvas
        draw={drawNamePlayers}
        width={SCREEN.FULL.width}
        height={SCREEN.FULL.height}
        style={styleCanvas}
      />
      <Canvas
        draw={drawScore}
        width={SCREEN.FULL.width}
        height={SCREEN.FULL.height}
        style={styleCanvas}
      />
      <Canvas
        getRef={(n) => { canvasAreaGameRef = n }}
        draw={drawAreaGame}
        width={SCREEN.AREA_GAME.width}
        height={SCREEN.AREA_GAME.height}
        onClick={handleCanvasAreaGameClick}
        style={styleCanvas} />
      <img ref={imgTitleGrassRef} src={imgTitleGrass} style={{ visibility: "hidden" }} width="0" height="0" alt="..." />
      <img ref={imgTitleBGTopRef} src={imgTitleBGTop} style={{ visibility: "hidden" }} width="0" height="0" alt="..." />
      <img ref={imgBoxName1Ref} src={imgBoxName1} style={{ visibility: "hidden" }} width="0" height="0" alt="..." />
      <img ref={imgBoxName2Ref} src={imgBoxName2} style={{ visibility: "hidden" }} width="0" height="0" alt="..." />
      <img ref={imgVictoryRef} src={imgVictory} style={{ visibility: "hidden" }} width="0" height="0" alt="..." />
      <img ref={imgLoseRef} src={imgLose} style={{ visibility: "hidden" }} width="0" height="0" alt="..." />
    </div>
  )
}

export default GameFindEgg