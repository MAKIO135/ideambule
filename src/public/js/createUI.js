addEventListener( 'load', e => {
    const populate = ( data ) => {

	};

	// async function constructInterface(){
	// 	let items = await fetch( 'data/data.json' )
	// 		.then( res => res.json() )
	// 		.catch( err => console.error( err ) )
	// 		.then( response => response );
	// 	return items;
	// };
	// constructInterface().then( items => console.log( items ) );


	let animationDone = true;
	const onAnimationStart = () => animationDone = false;
	const onAnimationDone = () => animationDone = true;

	// let startScroll = true, firstScrollPos = 0;
	// addEventListener( 'scroll', e => {
	// 	e.preventDefault();
	// 	console.log( window.pageYOffset );
	// 	if( startScroll ){
	// 		firstScrollPos = window.pageYOffset;
	// 		startScroll = false;
	// 	}
	// 	else{
	// 		if( firstScrollPos < window.pageYOffset ){
	// 			if( animationDone ){
	// 				TweenMax.to( window, 1, {
	// 					scrollTo: {
	// 						y: ( ~~( window.pageYOffset / 1200 ) + 1 ) * 1200
	// 					},
	// 					onComplete: () => {
	// 						startScroll = true;
	// 						onAnimationDone();
	// 					}
	// 				} );
	// 			}
	// 		}
	// 		else{
	// 			if( animationDone ){
	// 				TweenMax.to( window, 1, {
	// 					scrollTo: {
	// 						y: ( ~~( window.pageYOffset / 1200 ) ) * 1200
	// 					},
	// 					onComplete: () => {
	// 						startScroll = true;
	// 						onAnimationDone();
	// 					}
	// 				} );
	// 			}
	// 		}
	// 	}
	// } );


    const card = document.querySelector( '#card' );
    card.style.width = window.innerWidth + 'px';

    document.querySelectorAll( 'img' ).forEach( img => {
        if( img.classList.contains( 'verticalAlign' ) ){
            img.style.top = window.innerHeight / 2 - img.height / 2 + 'px';
        };

        if( img.classList.contains( 'horizontalAlign' ) ){
            img.style.left = window.innerWidth / 2 - img.width / 2 + 'px';
        };
    } );

    document.querySelectorAll( '.block>img' ).forEach( img => {
        img.style.left = window.innerWidth / 2 - img.width / 2 + 'px';
        img.style.top = window.innerHeight / 2 - img.width / 2 + 'px';
    } )

    const timerScreen = document.querySelector( '#timerScreen' );
    timerScreen.style.width = window.innerWidth + 'px';
    timerScreen.style.height = window.innerHeight + 'px';

    const timerImg = document.querySelector( '#timerImg' );
    timerImg.addEventListener( 'click', e => {
        console.log( 'click timer' )
        let currentOpacity = timerScreen.style.opacity;
        TweenMax.fromTo( timerScreen, 1.0, {
            zIndex: 3
        },
        {
            opacity: ( currentOpacity == 0 ? 1.0 : 0 ),
            delay: 0.5,
            ease: Power3.easeInOut,
            onComplete: () => {
                if( timerScreen.style.opacity == 0 ) timerScreen.style.zIndex = -1;
                onAnimationDone()
            }
        } );
    } );



    let currentTimeRow = 0;
    $( '#arrow_down' ).click( () => {
        currentTimeRow = ++ currentTimeRow;
        currentTimeRow = Math.min( currentTimeRow, 2 );
        console.log(currentTimeRow, document.querySelectorAll('.timeRow')[currentTimeRow], $(document.querySelectorAll('.timeRow')[currentTimeRow]));
        $('html, body').animate({
            scrollTop: $(document.querySelectorAll('.timeRow')[currentTimeRow]).offset().top
        }, 1000);
    } );
    $( '#arrow_up' ).click( () => {
        currentTimeRow = -- currentTimeRow;
        currentTimeRow = Math.max( currentTimeRow, 0 );
        console.log(currentTimeRow, document.querySelectorAll('.timeRow')[currentTimeRow], $(document.querySelectorAll('.timeRow')[currentTimeRow]));
        $('html, body').animate({
            scrollTop: $(document.querySelectorAll('.timeRow')[currentTimeRow]).offset().top
        }, 1000);
    } );


    let tl = new TimelineMax();
    tl.to( card, 0.5, {
        onStart: onAnimationStart,
        left: -window.innerWidth,
        delay: 1.0,
        ease: Power3.easeInOut
    } )
    .to( '.hidden', 1.5, {
        opacity: 1,
        delay: 0.3,
        ease: Power2.easeOut
    } );
} );
