module.exports = function Route(app) {

	var quotes = ['Life isn’t about getting and having, it’s about giving and being. –Kevin Kruse',
				  'Whatever the mind of man can conceive and believe, it can achieve. –Napoleon Hill',
				  'Strive not to be a success, but rather to be of value. –Albert Einstein',
				  'Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.  –Robert Frost',
				  'I attribute my success to this: I never gave or took any excuse. –Florence Nightingale',
				  'You miss 100% of the shots you don’t take. –Wayne Gretzky',
				  'I’ve missed more than 9000 shots in my career. I’ve lost almost 300 games. 26 times I’ve been trusted to take the game winning shot and missed. I’ve failed over and over and over again in my life. And that is why I succeed. –Michael Jordan',
				  'The most difficult thing is the decision to act, the rest is merely tenacity. –Amelia Earhart',
				  'Every strike brings me closer to the next home run. –Babe Ruth',
				  'Definiteness of purpose is the starting point of all achievement. –W. Clement Stone',
				  'We must balance conspicuous consumption with conscious capitalism. –Kevin Kruse',
				  'Life is what happens to you while you’re busy making other plans. –John Lennon',
				  'We become what we think about. –Earl Nightingale',
				  'Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do, so throw off the bowlines, sail away from safe harbor, catch the trade winds in your sails.  Explore, Dream, Discover. –Mark Twain',
				  'Life is 10% what happens to me and 90% of how I react to it. –Charles Swindoll',
				  'The most common way people give up their power is by thinking they don’t have any. –Alice Walker',
				  'The mind is everything. What you think you become.  –Buddha',
				  'The best time to plant a tree was 20 years ago. The second best time is now. –Chinese Proverb',
				  'An unexamined life is not worth living. –Socrates',
				  'Eighty percent of success is showing up. –Woody Allen'];
	var geekQuotes = ['Your time is limited, so don’t waste it living someone else’s life. –Steve Jobs',
					  'Winning isn’t everything, but wanting to win is. –Vince Lombardi',
					  'I am not a product of my circumstances. I am a product of my decisions. –Stephen Covey',
					  'Every child is an artist.  The problem is how to remain an artist once he grows up. –Pablo Picasso',
					  'You can never cross the ocean until you have the courage to lose sight of the shore. –Christopher Columbus',
					  'I’ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel. –Maya Angelou',
					  'Either you run the day, or the day runs you. –Jim Rohn',
					  'Whether you think you can or you think you can’t, you’re right. –Henry Ford',
					  'The two most important days in your life are the day you are born and the day you find out why. –Mark Twain',
					  'Whatever you can do, or dream you can, begin it.  Boldness has genius, power and magic in it. –Johann Wolfgang von Goethe',
					  'The best revenge is massive success. –Frank Sinatra',
					  'People often say that motivation doesn’t last. Well, neither does bathing.  That’s why we recommend it daily. –Zig Ziglar',
					  'Life shrinks or expands in proportion to one’s courage. –Anais Nin',
					  'If you hear a voice within you say “you cannot paint,” then by all means paint and that voice will be silenced. –Vincent Van Gogh',
					  'There is only one way to avoid criticism: do nothing, say nothing, and be nothing. –Aristotle',
					  'Ask and it will be given to you; search, and you will find; knock and the door will be opened for you. –Jesus',
					  'The only person you are destined to become is the person you decide to be. –Ralph Waldo Emerson',
					  'Go confidently in the direction of your dreams.  Live the life you have imagined. –Henry David Thoreau',
					  'When I stand before God at the end of my life, I would hope that I would not have a single bit of talent left and could say, I used everything you gave me. –Erma Bombeck',
					  'Few things can help an individual more than to place responsibility on him, and to let him know that you trust him.  –Booker T. Washington'];
	var geekEqs = [];
	var artEqs = [];
	var index = 0;
	var a;
	var b;
	var answer;

	app.get('/', function(req, res) {
		res.render('client');
	})

	app.io.route('join_room', function(req) {
		req.io.join(req.data.room);
		req.session.name = req.data.name;
		req.session.room = req.data.room;
		req.session.save(function() {
			if(req.data.room == 'Geeks') {
				req.io.emit('previous_equations', geekEqs)
			}
			if(req.data.room == 'Artists') {
				req.io.emit('previous_equations', artEqs)
			}
		})
	})

	app.io.route('request_quote', function(req, res) {
		if(req.session.room == 'Geeks') {
			a = Math.floor(Math.random()*12);
			b = Math.floor(Math.random()*12);
			req.io.emit('send_math_equation', {
				flag: req.session.room,
				num1: a,
				num2: b,
				message: 'I will give you an awesome quote if you can correctly answer the following math question:'
			})
			answer = a*b;
		}
		if(req.session.room == 'Artists') {
			a = Math.floor(Math.random()*100);
			b = Math.floor(Math.random()*100);
			req.io.emit('send_math_equation', {
				flag: req.session.room,
				num1: a,
				num2: b,
				message: 'I will give you an awesome quote if you can correctly answer the following math question:'
			})
			answer = a+b;
		}
	})

	app.io.route('submit_math_equation_answer', function(req, res) {
		if(answer == req.data) {
			if(req.session.room == 'Geeks') {
				var data = [ { flag: true },
							 { name: req.session.name},
							 { equation: a+" * "+b+" = "+req.data+"..."} ];
				geekEqs.push(data);
				app.io.room(req.session.room).broadcast('answer_log', "<p>"+req.session.name+": <span class='success'>"+a+" * "+b+" = "+req.data+"..."+"</span></p>");
				index = randomIndex(geekQuotes);
				req.io.emit('send_quote', geekQuotes[index]);
			}
			if(req.session.room == 'Artists') {
				var data = [ { flag: true },
							 { name: req.session.name},
							 { equation: a+" + "+b+" = "+req.data+"..."} ];
				artEqs.push(data);
				app.io.room(req.session.room).broadcast('answer_log', "<p>"+req.session.name+": <span class='success'>"+a+" + "+b+" = "+req.data+"..."+"</span></p>");
				index = randomIndex(quotes);
				req.io.emit('send_quote', quotes[index]);
			}
		} else {
			if(req.session.room == 'Geeks') {
				var data = [ { flag: false },
							 { name: req.session.name},
							 { equation: a+" * "+b+" = "+req.data+"..."} ];
				geekEqs.push(data);
				app.io.room(req.session.room).broadcast('answer_log', "<p>"+req.session.name+": <span class='error'>"+a+" * "+b+" = "+req.data+"..."+"</span></p>");
			}
			if(req.session.room == 'Artists') {
				var data = [ { flag: false },
							 { name: req.session.name},
							 { equation: a+" + "+b+" = "+req.data+"..."} ];
				artEqs.push(data);
				app.io.room(req.session.room).broadcast('answer_log', "<p>"+req.session.name+": <span class='error'>"+a+" + "+b+" = "+req.data+"..."+"</span></p>");
			}
			req.io.emit('wrong_answer', "You answered the math equation incorrectly. Please request a quote again.")
		}
	})

	function randomIndex(array) {
		var temp = Math.floor(Math.random()*(array.length-1));
		if(temp == index) {
			randomIndex();
		} else {
			return temp;
		}
	}

}