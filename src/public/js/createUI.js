addEventListener( 'load', e => {
    function onBlockClick( e ){
        console.log( this.dataset );
        let type = this.dataset.type;
        console.log( type )
        if( type == 'image' ){
            document.querySelector( '#variable' ).innerHTML = `<img src='data/views/${this.dataset.view}'>`
        }

        let tl = new TimelineMax();
        tl.to( card, 0.8, {
            left: 0,
            ease: Power3.easeInOut
        } )
        .to( card, 0.8, {
            left: -window.innerWidth,
            delay: 1.0,
            ease: Power3.easeInOut
        } );
    }

	async function constructInterface(){
		let json = await fetch( 'data/data.json' )
			.then( res => res.json() )
			.catch( err => console.error( err ) )
			.then( response => response );
		return json;
	};
	constructInterface().then( json => {
        [ "m5", "m15", "p15" ].forEach( cat => {
            let catRow = document.querySelector( `#${cat}>.row` );
            catRow.dataset.activeCard = 0;
            let hammer = new Hammer( catRow );

            let panDirection = null;
            hammer.on( 'panleft', e => {
                panDirection = 'left';
                catRow.style.left = 136 - catRow.dataset.activeCard * 592 + e.deltaX + 'px';
            } );
            hammer.on( 'panright', e => {
                panDirection = 'right';
                catRow.style.left = 136 - catRow.dataset.activeCard * 592 + e.deltaX + 'px';
            } );
            hammer.on( 'panup', e => {
                panDirection = 'up';
                document.body.scrollTop += e.deltaY;
            } );
            hammer.on( 'pandown', e => {
                panDirection = 'down';
                document.body.scrollTop += e.deltaY;
            } );

            hammer.on( 'panend', e => {
                direction = null;
                if( e.distance > 150 ){
                    if( panDirection == 'left' ){
                        catRow.dataset.activeCard ++;
                        catRow.dataset.activeCard = Math.min( catRow.dataset.activeCard, json.items[ cat ].length - 1 );

                        TweenMax.to( catRow, 0.3, {
                            left: 136 - catRow.dataset.activeCard * 592 + 'px',
                            ease: Power3.easeOut
                        } );
                    }
                    else if( panDirection == 'right' ){
                        catRow.dataset.activeCard --;
                        catRow.dataset.activeCard = Math.max( catRow.dataset.activeCard, 0 );
                        TweenMax.to( catRow, 0.3, {
                            left: 136 - catRow.dataset.activeCard * 592 + 'px',
                            ease: Power3.easeOut
                        } );
                    }

                }
                else{
                    TweenMax.to( catRow, 0.3, {
                        left: 136 - catRow.dataset.activeCard * 592 + 'px',
                        ease: Power3.easeOut
                    } );
                }
            } );

            json.items[ cat ].shuffle().forEach( ( item, i ) => {
                let block = document.createElement( 'div' );
                block.classList.add( 'block' );
                block.style.left = i * 592 + 'px';
                let img = new Image();
                if( i == 0 ) img.classList.add( 'active' );
                for( prop in item ){
                    img.dataset[ prop ] = item[ prop ];
                }
                img.src = `data/covers/${item.cover}`;
                block.appendChild( img );
                catRow.appendChild( block );
                img.addEventListener( 'click', onBlockClick );
            } );
        } );

        document.querySelectorAll( '.block>img' ).forEach( img => {
            img.style.top = window.innerHeight / 2 - 529 / 2 + 'px';
        } );
    } );


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
            }
        } );
    } );

    let currentTimeRow = 1;
    $('html, body').animate({
        scrollTop: $(document.querySelectorAll('.timeRow')[currentTimeRow]).offset().top
    }, 1000);
    $( '#arrow_down' ).click( () => {
        if( currentTimeRow == 0 ) $( '#arrow_up' ).fadeIn();
        else if( currentTimeRow == 1 ) $( '#arrow_down' ).fadeOut();

        currentTimeRow = ++ currentTimeRow;
        currentTimeRow = Math.min( currentTimeRow, 2 );
        $('html, body').animate({
            scrollTop: $(document.querySelectorAll('.timeRow')[currentTimeRow]).offset().top
        }, 1000);
    } );

    $( '#arrow_up' ).click( () => {
        if( currentTimeRow == 2 ) $( '#arrow_down' ).fadeIn();
        else if( currentTimeRow == 1 ) $( '#arrow_up' ).fadeOut();

        currentTimeRow = -- currentTimeRow;
        currentTimeRow = Math.max( currentTimeRow, 0 );
        $('html, body').animate({
            scrollTop: $(document.querySelectorAll('.timeRow')[currentTimeRow]).offset().top
        }, 1000);
    } );


    let tl = new TimelineMax();
    tl.to( card, 0.1, {
        left: -window.innerWidth,
        delay: 1.0,
        ease: Power3.easeInOut
    } )
    .to( '.hidden', 0.1, {
        opacity: 1,
        delay: 0.3,
        ease: Power2.easeOut
    } );
} );
