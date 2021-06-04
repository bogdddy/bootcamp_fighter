 var screen = {
    width: $('main').width(),
    height: $('main').height(),
    calcPercent: function(percent, axis) {
        return (percent * screen[axis]) / 100;
    }
}


function loadImage(url)
{
    // var img = new Image();
    // img.src = url;
	// return img;
    return {src: url};
}

class Character {
    
	constructor(char, side) {
		this.side = side;//localStorage.getItem("");
        this.char = char;
        this.health = 100;
        this.canMove = true;
        this.images = {
			attack: loadImage("../assets/images/chars/" + char + "/attack.gif"),
			defend: loadImage("../assets/images/chars/" + char + "/defend.gif"),
			hurt: loadImage("../assets/images/chars/" + char + "/hurt.gif"),
			idle: loadImage("../assets/images/chars/" + char + "/idle.gif"),
			run: loadImage("../assets/images/chars/" + char + "/run.gif"),
		}
        this.controls = {
            left: side == 'left' ? 'a' : 'ArrowLeft',
            right: side == 'left' ? 'd' : 'ArrowRight',
            up: side == 'left' ? 'w' : 'ArrowUp',
            down: side == 'left' ? 's' : 'ArrowDown'
        }
        $( document ).keydown(this.controlsHandler.bind(this));
        $( document ).keyup(this.controlsHandler.bind(this));
        //$( document ).keypress(this.controlsHandler.bind(this));
        setInterval(this.update.bind(this), 100);
	}
    spawn() {
        $('main').append(`
            <img src="${this.images.idle.src}" id="character-${this.side}" class="character pixelart" width="${screen.calcPercent('25', 'width')}" data-mode="video" >
        `);
        this.charReference = $('#character-' + this.side)
        if (this.char == 'char3' || this.char == 'char4') {
            this.charReference.css({filter: 'grayscale(1)'});
        }
        if (this.side == 'right') {
            this.charReference.css({left: (screen.width - 20) - screen.calcPercent('25', 'width'), bottom: 20});
        } else {
            this.charReference.css({left: 20, bottom: 20});
            this.charReference.addClass('flipped');
        }
    }

    controlsHandler(event) {
        //console.log(event) 
        switch (event.key) {
            case this.controls.left:
                if (event.type == "keydown" && !this.movingLeft && this.canMove && !this.isDown) {
                    this.movingLeft = true;
                    this.charReference.attr('src', this.images.run.src);
                    this.charReference.removeClass('flipped');
                } else if (event.type == "keyup") {
                    this.movingLeft = false;
                    if (this.canMove && !this.isDown) {
                        this.charReference.attr('src', this.images.idle.src);
                    }
                }
                break;
            case this.controls.right:
                if (event.type == "keydown" && !this.movingRight && this.canMove && !this.isDown) {
                    this.movingRight = true;
                    this.charReference.attr('src', this.images.run.src);
                    this.charReference.addClass('flipped');
                } else if (event.type == "keyup") {
                    this.movingRight = false;
                    if (this.canMove && !this.isDown) {
                        this.charReference.attr('src', this.images.idle.src);
                    }
                }
                break;
            case this.controls.up:
                if (event.type == "keydown" && this.canMove && !this.isDown) {
                    this.canMove = false;
                    this.charReference.attr('src', this.images.attack.src);
                    if (this.arePlayersClose() && this.enemy().charReference.hasClass('flipped') == this.charReference.hasClass('flipped')) {
                        this.enemy().canMove = false;
                        setTimeout(() => {
                            this.enemy().charReference.attr('src', this.enemy().images.hurt.src); 
                        }, 150);
                    } else if (this.arePlayersClose() && !this.enemy().isDown) {
                        this.enemy().canMove = false;
                        setTimeout(() => {
                            this.enemy().charReference.attr('src', this.enemy().images.hurt.src); 
                            this.enemy().getDamage(5);
                        }, 150);
                    }
                    setTimeout(() => {
                        if ( this.enemy().charReference.attr('src') == this.enemy().images.hurt.src) {
                            this.enemy().charReference.attr('src', this.enemy().images.idle.src); 
                        }
                        this.enemy().canMove = true;
                        this.canMove = true;
                        this.charReference.attr('src', this.images.idle.src); 
                    }, 560);
                }
                break;
            case this.controls.down:
                if (event.type == "keydown" && this.canMove) {
                    this.canMove = false;
                    this.isDown = true;
                    this.charReference.attr('src', this.images.defend.src);
                } else if (event.type == "keyup") {
                    this.canMove = true;
                    this.isDown = false;
                    this.charReference.attr('src', this.images.idle.src);
                }
                break;
        }
        
    }

    update() {
        if (!this.canMove) return;
        if (this.movingLeft && this.movingRight) {
            this.charReference.attr('src', this.images.idle.src);
            return;
        }
        if (this.movingLeft) {
            if (this.side == 'right' && this.arePlayersClose()) {
                return;
            }
            this.charReference.animate({ left: parseFloat(this.charReference.css('left')) - 25 }, 91 )
            if (this.charReference.attr('src') != this.images.run.src) {
                this.charReference.attr('src', this.images.run.src);
            }
        }
        if (this.movingRight) {
            if (this.side == 'left' && this.arePlayersClose()) {
                return;
            }
            this.charReference.animate({ left: parseFloat(this.charReference.css('left')) + 25 }, 91 )
            if (this.charReference.attr('src') != this.images.run.src) {
                this.charReference.attr('src', this.images.run.src);
            }
        }
    }

    enemy() {
        return chars[this.side == 'left' ? 'right' : 'left'];
    }

    arePlayersClose() {
        return parseFloat(chars.right.charReference.css('left')) - parseFloat(chars.left.charReference.css('left')) + screen.calcPercent('25', 'width') < screen.calcPercent('25', 'width') * 1.5;
    }

    getDamage(quantity) {
        this.health -= quantity;
        console.log(this.side == 'left' ? 'one' : 'two');
        $('.healthbar__meter--player-'+(this.side == 'left' ? 'one' : 'two')).animate({
            width: (this.health * 100) / 100+'%'
        }, 'slow');
    }
    
}

if (localStorage.getItem('player1') == null) {
    localStorage.setItem('player1', 'char' + (Math.floor(Math.random() * 4) + 1))
}
if (localStorage.getItem('player2') == null) {
    localStorage.setItem('player2', 'char' + (Math.floor(Math.random() * 4) + 1))
}

var chars = {
    left: new Character(localStorage.getItem('player1'), 'left'),
    right: new Character(localStorage.getItem('player2'), 'right')
}

localStorage.removeItem('player1');
localStorage.removeItem('player2');

chars.left.spawn()
chars.right.spawn()

var timerInterval = setInterval(function() {
    $('.timer').text(($('.timer').text() - 1) + "");
    
    if(parseInt($('.timer').text()) < 1) {
      clearInterval(timerInterval);
    }
    
    if(parseInt($('.timer').text()) < 10) {
      $('.timer').text("0" + ($('.timer').text()) + "");
    };
  }, 1000);

$('.healthbar__meter--player-one').animate({
  width: '100%'
}, 'slow');

$('.healthbar__meter--player-two').animate({
  width: '100%'
}, 'slow');
