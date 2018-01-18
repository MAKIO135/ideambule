addEventListener( 'load', e => {
    ( function populateTimeRows(){
        async function constructInterface(){
            let json = await fetch( 'data/data.json' )
            .then( res => res.json() )
            .catch( err => console.error( err ) )
            .then( response => response );
            return json;
        };
        constructInterface().then( json => {
            [ "m5", "m15", "p15" ].forEach( cat => {
                let timeRow = document.querySelector( `#${cat}` );
                let blocksRow = timeRow.querySelector( `.row` );
                blocksRow.dataset.activeBlock = 0;
                let hammer = new Hammer( blocksRow );

                let panDirection = null;
                hammer.on( 'panleft', e => {
                    panDirection = 'left';
                    blocksRow.style.left = 136 - blocksRow.dataset.activeBlock * 592 + e.deltaX + 'px';
                } );
                hammer.on( 'panright', e => {
                    panDirection = 'right';
                    blocksRow.style.left = 136 - blocksRow.dataset.activeBlock * 592 + e.deltaX + 'px';
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
                    if( e.distance > 150 ){
                        if( panDirection == 'left' ){
                            let blockImgs = blocksRow.querySelectorAll( '.block>img' );
                            blockImgs[ blocksRow.dataset.activeBlock ].classList.remove( 'active' );
                            blocksRow.dataset.activeBlock ++;
                            blocksRow.dataset.activeBlock = Math.min( blocksRow.dataset.activeBlock, blockImgs.length - 1 );
                            blockImgs[ blocksRow.dataset.activeBlock ].classList.add( 'active' );
                            blocksRow.dataset.activeBlock = Math.min( blocksRow.dataset.activeBlock, json.items[ cat ].length - 1 );

                            TweenMax.to( blocksRow, 0.3, {
                                left: 136 - blocksRow.dataset.activeBlock * 592 + 'px',
                                ease: Power3.easeOut
                            } );
                        }
                        else if( panDirection == 'right' ){
                            let blockImgs = blocksRow.querySelectorAll( '.block>img' );
                            blockImgs[ blocksRow.dataset.activeBlock ].classList.remove( 'active' );
                            blocksRow.dataset.activeBlock --;
                            blocksRow.dataset.activeBlock = Math.max( blocksRow.dataset.activeBlock, 0 );
                            blockImgs[ blocksRow.dataset.activeBlock ].classList.add( 'active' );
                            blocksRow.dataset.activeBlock = Math.max( blocksRow.dataset.activeBlock, 0 );
                            TweenMax.to( blocksRow, 0.3, {
                                left: 136 - blocksRow.dataset.activeBlock * 592 + 'px',
                                ease: Power3.easeOut
                            } );
                        }
                        else{
                            panDirection = null;
                            TweenMax.to( blocksRow, 0.3, {
                                left: 136 - blocksRow.dataset.activeBlock * 592 + 'px',
                                ease: Power3.easeOut
                            } );
                        }
                    }
                    else{
                        panDirection = null;
                        TweenMax.to( blocksRow, 0.3, {
                            left: 136 - blocksRow.dataset.activeBlock * 592 + 'px',
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
                    blocksRow.appendChild( block );
                    img.addEventListener( 'click', onBlockClick );
                } );
            } );

            document.querySelectorAll( '.block>img' ).forEach( img => {
                img.style.top = window.innerHeight / 2 - 529 / 2 + 'px';
            } );
        } );
    } )();

    function closeCardHandler( e ){
        TweenMax.to( card, 0.8, {
            onStart: () => document.body.scrollTop = prevScrollTop,
            left: -window.innerWidth + 'px',
            ease: Power3.easeInOut,
            onComplete: () => card.scrollTop = 0
        } );
    }

    let prevScrollTop = 0;
    function onBlockClick( e ){
        if( this.classList.contains( 'active' ) ){
            prevScrollTop = window.scrollY;
            let back = document.querySelector( '#back' );
            back.style.opacity = 1;
            back.addEventListener( 'click', closeCardHandler );

            document.querySelector( '#cardContent' ).innerHTML = `<img src='data/views/${this.dataset.view}'>`
            card.type = this.dataset.type;
            if( card.type == 'audio' ){
                $('#audioUI').show();
                cardAudioEl.src= '';
            }
            else{
                $('#audioUI').hide();
            }

            TweenMax.to( card, 0.8, {
                left: 0,
                ease: Power3.easeInOut
            } );
        }
    }

    const card = document.querySelector( '#card' );
    card.style.width = window.innerWidth + 'px';
    card.style.height = window.innerHeight + 'px';
    let cardSwipe = new Hammer( card );
    cardSwipe.on( 'swipeleft', closeCardHandler );
    let cardAudioEl = card.querySelector( 'audio' );

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

    $('#fav').click( () => $( '#favSelected' ).toggle() );
    $('#dislike').click( () => $( '#dislikeSelected' ).toggle() );

    ( function verticalScrollHandler(){
        let lastScrollTimeOut = null;
        let currentTimeRow = 1;
        let timeRows = document.querySelectorAll('.timeRow');

        $('html, body').animate({
            scrollTop: $(timeRows[currentTimeRow]).offset().top
        }, 1000);
        $( '#arrow_down' ).click( () => {
            if( currentTimeRow == 0 ) $( '#arrow_up' ).fadeIn();
            else if( currentTimeRow == 1 ) $( '#arrow_down' ).fadeOut();

            currentTimeRow = ++ currentTimeRow;
            currentTimeRow = Math.min( currentTimeRow, 2 );
            $('html, body').animate({
                scrollTop: $(timeRows[currentTimeRow]).offset().top
            }, 1000);
        } );

        $( '#arrow_up' ).click( () => {
            if( currentTimeRow == 2 ) $( '#arrow_down' ).fadeIn();
            else if( currentTimeRow == 1 ) $( '#arrow_up' ).fadeOut();

            currentTimeRow = -- currentTimeRow;
            currentTimeRow = Math.max( currentTimeRow, 0 );
            $('html, body').animate({
                scrollTop: $(timeRows[currentTimeRow]).offset().top
            }, 1000);
        } );

        addEventListener( 'scroll', e => {
            clearTimeout( lastScrollTimeOut );
            lastScrollTimeOut = setTimeout( () => {

                currentTimeRow = Math.round( window.scrollY/ 1280 );
                if( currentTimeRow == 0 ){
                    $( '#arrow_down' ).fadeIn();
                    $( '#arrow_up' ).fadeOut();
                }
                else if( currentTimeRow == 1 ){
                    $( '#arrow_down' ).fadeIn();
                    $( '#arrow_up' ).fadeIn();
                }
                else if( currentTimeRow == 2 ){
                    $( '#arrow_down' ).fadeOut();
                    $( '#arrow_up' ).fadeIn();
                }

                $('html, body').animate( {
                    scrollTop: $(timeRows[currentTimeRow]).offset().top
                }, 200 );
            }, 300 );
        } );
    } )();

    ( function glowyEffect(){
        let shadow = {
            value : 5
        };
        TweenMax.to( shadow, 2.0, {
            value: 15,
            onUpdate: () => $('.shadowed').css( {
                filter: `drop-shadow(0px 0px ${shadow.value}px white)`
            } ),
            yoyo: true,
            repeat: -1,
            ease: Power3.easeInOut
        } );
    } )();

    ( function onOpenApp(){
        let tl = new TimelineMax();
        tl.to( card, 0.1, {
            left: -window.innerWidth,
            delay: 1.0,
            ease: Power3.easeInOut,
            onComplete: () => card.style.backgroundColor = 'rgba(0,0,0,0)'
        } )
        .to( '.hidden', 0.1, {
            opacity: 1,
            delay: 0.3,
            ease: Power2.easeOut
        } );
    } )();
} );
