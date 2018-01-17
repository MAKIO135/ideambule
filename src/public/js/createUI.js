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

    document.querySelectorAll( '.verticalAlign' ).forEach( e => {
        e.style.top = window
    } );

    document.querySelectorAll( '.horizontalAlign' ).forEach( e => {
        e.style.top = window
    } );

    const timerScreen = document.querySelector( '#timerScreen' );
    timerScreen.style.width = window.innerWidth + 'px';
    timerScreen.style.height = window.innerHeight + 'px';
    timerScreen.style.top = -window.innerHeight + 'px';

    const timerImg = document.querySelector( '#timerImg' );
    timerImg.style.top = window.innerHeight / 2 - timerImg.height / 2 + 'px';
    timerImg.addEventListener( 'click', e => {
        document.querySelector( '#variable' ).innerHTML = `

        `;

        TweenMax.to( timerScreen, 0.5, {
            top: 0,
            delay: 0.5,
            ease: Power3.easeInOut,
            onComplete: onAnimationDone
        } );
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
