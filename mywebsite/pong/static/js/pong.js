import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

// standard global variables
var scene, camera, renderer, controls, loader;
// var keyboard = new THREEx.KeyboardState();

// custom global variables
var cube, line, ball, ballBB, ballTexture, leftPaddle, leftPaddleOutLine, leftPaddleBB, rightPaddle, rightPaddleOutLine, rightPaddleBB, keys, scoreMesh;
var pongSocket;
var scoreGeometry, scoreFont, gameOver;
// const PADDLE_SPEED = 0.2;
const BALL_SPEED = 0.1;
const BALL_SIZE = 0.2; // maybe a bit bigger
const MAX_HEIGHT = 4.5; // idk how to name this
const MIN_HEIGHT = -4.5;
var ballSpeed = {x: BALL_SPEED, y: BALL_SPEED};
var leftPlayerScore = 0; // player 1
var rightPlayerScore = 0; // player 2



ConnectWebsocket();

export function test()
{
    console.log("Print from test function");
}

function DisconnectWebsocket()
{
	pongSocket.close(1000, "Quit Button Pressed");
	console.log("Connection closed!");
}

function ConnectWebsocket()
{
	// WEBSOCKET
	const url = `ws://${window.location.host}/ws/pong-socket-server/`;
	console.log("Url: " + url);
	pongSocket = new WebSocket(url);

	pongSocket.onmessage = function(e){
		let data = JSON.parse(e.data);
		console.log('Data:', data);
	};

	pongSocket.onopen = function(e){
		console.log('CLIENT Connected!');
		StartGame();
	}

    pongSocket.onclose = function(e){
        console.log('CLIENT Disconnect!');
    }
}


function abs(num)
{
    if (num < 0)
        return (-num);
    return (num);
}

function onWindowResize()
{
	const width = window.innerWidth;
	const height = window.innerHeight;

	// camera.aspect = 16 / 9;
	// camera.updateProjectionMatrix();

	// might need to change so it's not fullscreen
	renderer.setSize( width, height );
	console.log("Window Resized!");
	console.log("width: " + width + " height: " + height);
}

function StartGame()
{
	// TODO: I think i should load everything (all font, textures...) before initializing the rest
	Load();
	Init();
	pongSocket.onmessage = function(e){
		let data = JSON.parse(e.data);
		console.log('Data:', data);

		if (data.ballPosition && data.ballVelocity && typeof data.player1Pos !== 'undefined'
			&& typeof data.player2Pos !== 'undefined' && typeof data.player1Score !== 'undefined'
			&& typeof data.player2Score !== 'undefined' && typeof data.gameOver !== 'undefined')
		{
			ball.position.x = parseFloat(data.ballPosition[0]);
			ball.position.y = parseFloat(data.ballPosition[1]);
			ballSpeed.x = parseFloat(data.ballVelocity[0]);
			ballSpeed.y = parseFloat(data.ballVelocity[1]);
			leftPaddle.position.y = parseFloat(data.player1Pos);
			rightPaddle.position.y = parseFloat(data.player2Pos);
			gameOver = parseInt(data.gameOver);
			let player1Score = parseFloat(data.player1Score);
			let player2Score = parseFloat(data.player2Score);

			if (player1Score != leftPlayerScore || player2Score != rightPlayerScore)
			{
				leftPlayerScore = player1Score;
				rightPlayerScore = player2Score;
				createScoreText();
			}
		}
	};
	Loop();
	//Cleanup();
}

function Load()
{
	// SCORE FONT
	loader = new FontLoader();
	loader.load( '../../static/fonts/roboto_condensed.json', function ( font ) {
		scoreFont = font;

		createScoreText();
	});

	// BALL TEXTURE
	const textureLoader = new THREE.TextureLoader();
	ballTexture = textureLoader.load("../../static/textures/ball_texture.png")

}

function createScoreText()
{
    if (scoreMesh) {
        scene.remove(scoreMesh);
        scoreMesh.geometry.dispose();
        scoreMesh.material.dispose();
    }
	scoreGeometry = new TextGeometry( leftPlayerScore + "  :  " + rightPlayerScore, {
		font: scoreFont,
		size: 1,
		// !!!! Use height and not depth
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 5
	});
	
	const scoreMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
	scoreMesh = new THREE.Mesh(scoreGeometry, scoreMaterial);

	if (gameOver == 1)
	{
		const gameOverGeometry = new TextGeometry ("GAME OVER", {
			font: scoreFont,
			size: 1.5,
			// !!!! Use height and not depth
			height: 0.2,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.03,
			bevelSize: 0.02,
			bevelOffset: 0,
			bevelSegments: 5
		});

		const gameOverMaterial = new THREE.MeshBasicMaterial({color: 0xbd4500});
		const gameOverMesh = new THREE.Mesh(gameOverGeometry, gameOverMaterial);

		
		gameOverGeometry.computeBoundingBox();
		const gameOverBB = gameOverGeometry.boundingBox;
		const gameOverSize = new THREE.Vector3();
		gameOverBB.getSize(gameOverSize);
		gameOverMesh.position.x = -gameOverSize.x / 2;
		gameOverMesh.position.y = -gameOverSize.y / 2;
		gameOverMesh.position.z = -gameOverSize.z / 2;
		gameOverMesh.position.z += 3;
		scene.add(gameOverMesh);

	}

	// Compute the bounding box and center the score
	scoreGeometry.computeBoundingBox();
	const scoreBoundingBox = scoreGeometry.boundingBox;
	const scoreSize = new THREE.Vector3();
	scoreBoundingBox.getSize(scoreSize);
	scoreMesh.position.x = -scoreSize.x / 2;
	scoreMesh.position.y = -scoreSize.y / 2;
	scoreMesh.position.z = -scoreSize.z / 2;

	scoreMesh.position.y += 6;
	scoreMesh.position.z += 1.5;
	scoreMesh.rotateX(45);
	scene.add(scoreMesh);
}

function Init()
{
    // SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa400bd);

    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	// FIXED ASPECT RATIO Best fix so we always see the whole pong
    var VIEW_ANGLE = 45, ASPECT = 16 / 9, NEAR = 0.1, FAR = 2000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, -11, 13);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // WINDOW RESIZE
	window.addEventListener( 'resize', onWindowResize );
	console.log("width: " + SCREEN_WIDTH + " height: " + SCREEN_HEIGHT);


    // RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true, canvas: gameCanvas});
	renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.setClearColor(0x1c1c1c, 1); // same as scene.background
    document.body.appendChild(renderer.domElement);
    // renderer.setAnimationLoop(animate);

    // CONTROLS
    controls = new OrbitControls( camera, renderer.domElement);
    controls.update();

    // LIGHT
    // can't see textures without light
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0, 0, 10);
	scene.add(light);

    // INPUT
    keys = {
        a: false,
        s: false,
        d: false,
        w: false,
        arrowup: false,
        arrowdown: false,
        i: false
      };

    document.body.addEventListener( 'keydown', function(e) {
    var key = e.code.replace('Key', '').toLowerCase();
    // console.log("key: " + key);
    if ( keys[ key ] !== undefined )
        keys[ key ] = true;
    });

    document.body.addEventListener( 'keyup', function(e) {
    var key = e.code.replace('Key', '').toLowerCase();
    if ( keys[ key ] !== undefined )
        keys[ key ] = false;
    });


    // MATERIAL
    const lineMaterial = new THREE.LineDashedMaterial( { color: 0x353535, linewidth: 1, scale: 1, dashSize: 0.5, gapSize: 0.5 } );
    const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x353535 });
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const blackMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const redWireframeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const paddleOutlineMaterial = new THREE.MeshBasicMaterial({ color: 0xd1d1d1, side: THREE.BackSide });
    const ballMaterial = new THREE.MeshBasicMaterial({map: ballTexture});


    // CUSTOM GEOMETRY

    // Arena
    const arenaFloorGeometry = new THREE.BoxGeometry(16, 9, 0.5);
    const arenaSmallSideGeometry = new THREE.BoxGeometry(0.5, 10, 0.5);
    const arenaLargeSideGeometry = new THREE.BoxGeometry(17, 0.5, 0.5);
    const arenaFloor = new THREE.Mesh(arenaFloorGeometry, blackMaterial);
    const arenaLeftSide = new THREE.Mesh(arenaSmallSideGeometry, whiteMaterial);
    const arenaTopSide = new THREE.Mesh(arenaLargeSideGeometry, whiteMaterial);
    const arenaBottomSide = arenaTopSide.clone();
    const arenaRightSide = arenaLeftSide.clone();
    scene.add(arenaFloor);
    scene.add(arenaLeftSide);
    scene.add(arenaTopSide);
    scene.add(arenaRightSide);
    scene.add(arenaBottomSide);
    arenaFloor.position.z -= 0.5;
    arenaTopSide.position.y += 4.75;
    arenaBottomSide.position.y -= 4.75;
    arenaRightSide.position.x += 8.25;
    arenaLeftSide.position.x -= 8.25;

    // Ball
    const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const ballGeometry = new THREE.SphereGeometry(BALL_SIZE, 64, 32);
    cube = new THREE.Mesh(cubeGeometry, redWireframeMaterial);
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(cube);
    scene.add(ball);

    ballBB = new THREE.Sphere(ball.position, BALL_SIZE);


    // Paddles
    const paddleGeometry = new THREE.BoxGeometry(0.2, 2, 0.2);
    leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    leftPaddleOutLine = new THREE.Mesh(paddleGeometry, paddleOutlineMaterial);
    rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    rightPaddleOutLine = new THREE.Mesh(paddleGeometry, paddleOutlineMaterial);
    scene.add(leftPaddle);
    scene.add(leftPaddleOutLine);
    scene.add(rightPaddleOutLine);
    scene.add(rightPaddle);
    leftPaddle.position.x -= 7.5;
    leftPaddleOutLine.position.x = leftPaddle.position.x;
    leftPaddleOutLine.scale.multiplyScalar(1.05);
    leftPaddleOutLine.scale.x *= 1.2;
    rightPaddle.position.x += 7.5;
    rightPaddleOutLine.position.x = rightPaddle.position.x;
    rightPaddleOutLine.scale.multiplyScalar(1.05);
    rightPaddleOutLine.scale.x *= 1.2;

    leftPaddleBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    leftPaddleBB.setFromObject(leftPaddle);

    rightPaddleBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    rightPaddleBB.setFromObject(rightPaddle);


    // Middle Line

    const points = [];
    points.push( new THREE.Vector3( 0, MAX_HEIGHT, -0.20 ) );
    points.push( new THREE.Vector3( 0, MIN_HEIGHT, -0.20) );
    const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
    line = new THREE.Line( lineGeometry, lineMaterial );
    scene.add(line);
    line.computeLineDistances();

}


function Loop()
{
	requestAnimationFrame(Loop);
	Inputs();
	Update();
	Render();
}

function Inputs()
{
	// Info
	if (keys.i)
	{
		console.log("[INFO]");
		console.log("[right paddle] x: " + leftPaddle.position.x + " y: " + leftPaddle.position.y + " z: " + leftPaddle.position.z);
		console.log("[ball] x: " + ball.position.x + " y: " + ball.position.y + " z: " + ball.position.z);
		console.log("[right paddle] x: " + rightPaddle.position.x + " y: " + rightPaddle.position.y + " z: " + rightPaddle.position.z);
	}

	//CLIENT SIDE PADDLE INPUTS
	if (keys.w)
	{
		pongSocket.send(JSON.stringify({
			// 'player_id':'1',
			'action':'up'
		}))
	}

	if (keys.s)
	{
		pongSocket.send(JSON.stringify({
			// 'player_id':'1',
			'action':'down'
		}))
	}

	if (keys.arrowup)
	{
		pongSocket.send(JSON.stringify({
			// 'player_id':'2',
			'action':'up'
		}))
	}

	if (keys.arrowdown)
	{
		pongSocket.send(JSON.stringify({
			// 'player_id':'2',
			'action':'down'
		}))
	}
}

function Update()
{
    // Wireframe Cube
    cube.position.x = ball.position.x;
    cube.position.y = ball.position.y;

	// Paddle Outline
	leftPaddleOutLine.position.y = leftPaddle.position.y;
    rightPaddleOutLine.position.y = rightPaddle.position.y;

    // ballBB.copy(ball.geometry.boundingBox);
    // leftPaddleBB.copy(leftPaddle.geometry.boundingBox).applyMatrix4(leftPaddle.matrixWorld);
    // rightPaddleBB.copy(rightPaddle.geometry.boundingBox).applyMatrix4(rightPaddle.matrixWorld);

	// // BALL-PADDLE COLLISIONS
    // // TODO: collision with upper and lower side of the paddle

    // if (ballBB.intersectsBox(rightPaddleBB))
    // {
    //     cube.material.color = new THREE.Color(0x00ff00);
    //     ballSpeed.x = -ballSpeed.x;
    //     ball.position.x += ballSpeed.x;
    // }
    // else
   	// 	cube.material.color = new THREE.Color(0xff0000);


    // if (ballBB.intersectsBox(leftPaddleBB))
	// {
	// 	cube.material.color = new THREE.Color(0x00ff00);
	// 	ballSpeed.x = -ballSpeed.x;
	// 	ball.position.x += ballSpeed.x;
	// }
	// else
	// 	cube.material.color = new THREE.Color(0xff0000);


    controls.update();
}

function Render()
{
    renderer.render(scene, camera);
}


