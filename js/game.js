// 创建画布
var canvas = document.createElement("canvas");
var container = document.getElementById("container");
var ctx = canvas.getContext("2d");
var direct = Math.random()*(2*Math.PI);
var time = 60;
canvas.width = 512;
canvas.height = 480;
container.appendChild(canvas);

// 背景图实现
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// 英雄
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// 哥布林
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// 游戏人物实例
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {
	speed:128
};
var monstersCaught = 0;

// 键盘事件队列
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// 当哥布林被抓后重置哥布林
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	direct = Math.random()*(2*Math.PI);
	// 随机显示哥布林
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// 实时更新人物对象数据
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
	//英雄边界处理
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
	//哥布林碰撞边界处理
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
	//哥布林移动
	monster.x += Math.cos(direct)*monster.speed*modifier;
	monster.y += Math.sin(direct)*monster.speed*modifier;
	// 判断是否抓住哥布林
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

// 绘制
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

	// 得分与倒计时
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	ctx.fillText("Time: " + parseInt(time), 32, 64);
};

// 主循环
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
	time -= delta/1000;
	if(time>=0){
		// 帧动画
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
// 跨浏览器支持 requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
