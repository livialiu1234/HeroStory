// ��������
var canvas = document.createElement("canvas");
var container = document.getElementById("container");
var ctx = canvas.getContext("2d");
var direct = Math.random()*(2*Math.PI);
var time = 60;
canvas.width = 512;
canvas.height = 480;
container.appendChild(canvas);

// ����ͼʵ��
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Ӣ��
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// �粼��
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// ��Ϸ����ʵ��
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {
	speed:128
};
var monstersCaught = 0;

// �����¼�����
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// ���粼�ֱ�ץ�����ø粼��
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	direct = Math.random()*(2*Math.PI);
	// �����ʾ�粼��
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// ʵʱ���������������
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}
	//Ӣ�۱߽紦��
	if(hero.y<0){
		hero.y=canvas.height;
	}
	if(hero.y>canvas.height){
		hero.y=0;
	}
	if(hero.x<0){
		hero.x=canvas.width;
	}
	if(hero.x>canvas.width){
		hero.x=0;
	}
	//�粼����ײ�߽紦��
	if(monster.y<=0){
		direct=(Math.PI)*Math.random();
	}
	if(monster.y>=canvas.height){
		direct=Math.PI+(Math.PI)*Math.random();
	}
	if(monster.x<=0){
		direct=3*Math.PI/2+(Math.PI)*Math.random();
	}
	if(monster.x>=canvas.width){
		direct=Math.PI/2+(Math.PI)*Math.random();
	}
	//�粼���ƶ�
	monster.x += Math.cos(direct)*monster.speed*modifier;
	monster.y += Math.sin(direct)*monster.speed*modifier;
	// �ж��Ƿ�ץס�粼��
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		monster.speed+=2;
		++time;
		reset();
	}
};

// ����
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// �÷��뵹��ʱ
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	ctx.fillText("Time: " + parseInt(time), 32, 64);
};

// ��ѭ��
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
	time -= delta/1000;
	if(time>=0){
		// ֡����
		requestAnimationFrame(main);
	}else{
		ctx.fillText("Game Over", 192,canvas.height/2);
	}
};

var replay = function(){
	time = 60;
	monstersCaught = 0;
	reset();
	main();
}
// �������֧�� requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
