var FileTable = (function () { 'use strict';

var template = (function () {
  return {
    helpers: {
        format_size: (size) => {
            let res = size + " bytes";
            let suffix = [" TB", " GB", " MB", " kB"];
            while (size > 1024) {
                size /= 1024;
                res = (Math.round(size * 10) / 10) + suffix.pop();
            }
            return res;
        }
    }
  };
}());

function renderMainFragment ( root, component, target ) {
	var div = document.createElement( 'div' );
	
	var ifBlock_0_anchor = document.createComment( "#if files.length" );
	div.appendChild( ifBlock_0_anchor );
	
	function getBlock_0 ( root ) {
		if ( root.files.length ) return renderIfBlock_0_0;
		return null;
	}
	
	var currentBlock_0 = getBlock_0( root );
	var ifBlock_0 = currentBlock_0 && currentBlock_0( root, component, div, ifBlock_0_anchor );
	
	target.appendChild( div )

	return {
		update: function ( changed, root ) {
			var _currentBlock_0 = currentBlock_0;
			currentBlock_0 = getBlock_0( root );
			if ( _currentBlock_0 === currentBlock_0 && ifBlock_0) {
				ifBlock_0.update( changed, root );
			} else {
				if ( ifBlock_0 ) ifBlock_0.teardown( true );
				ifBlock_0 = currentBlock_0 && currentBlock_0( root, component, div, ifBlock_0_anchor );
			}
		},

		teardown: function ( detach ) {
			if ( detach ) div.parentNode.removeChild( div );
			
			if ( ifBlock_0 ) ifBlock_0.teardown( detach );
		}
	};
}

function renderIfBlock_0_0 ( root, component, target, anchor ) {
	var table = document.createElement( 'table' );
	table.className = "u-full-width";
	
	var thead = document.createElement( 'thead' );
	
	var tr = document.createElement( 'tr' );
	
	var th = document.createElement( 'th' );
	
	th.appendChild( document.createTextNode( "Name" ) );
	
	tr.appendChild( th )
	
	var th1 = document.createElement( 'th' );
	
	th1.appendChild( document.createTextNode( "Type" ) );
	
	tr.appendChild( th1 )
	
	var th2 = document.createElement( 'th' );
	
	th2.appendChild( document.createTextNode( "Size" ) );
	
	tr.appendChild( th2 )
	
	thead.appendChild( tr )
	
	table.appendChild( thead )
	
	table.appendChild( document.createTextNode( "\n        " ) );
	
	var tbody = document.createElement( 'tbody' );
	
	var eachBlock_0_anchor = document.createComment( "#each files" );
	tbody.appendChild( eachBlock_0_anchor );
	
	var eachBlock_0_value = root.files;
	var eachBlock_0_fragment = document.createDocumentFragment();
	var eachBlock_0_iterations = [];
	
	for ( var i = 0; i < eachBlock_0_value.length; i += 1 ) {
		eachBlock_0_iterations[i] = renderEachBlock_0( root, eachBlock_0_value, eachBlock_0_value[i], i, component, eachBlock_0_fragment );
	}
	
	eachBlock_0_anchor.parentNode.insertBefore( eachBlock_0_fragment, eachBlock_0_anchor );
	
	table.appendChild( tbody )
	
	anchor.parentNode.insertBefore( table, anchor )

	return {
		update: function ( changed, root ) {
			var eachBlock_0_value = root.files;
			
			for ( var i = 0; i < eachBlock_0_value.length; i += 1 ) {
				if ( !eachBlock_0_iterations[i] ) {
					eachBlock_0_iterations[i] = renderEachBlock_0( root, eachBlock_0_value, eachBlock_0_value[i], i, component, eachBlock_0_fragment );
				} else {
					eachBlock_0_iterations[i].update( changed, root, eachBlock_0_value, eachBlock_0_value[i], i );
				}
			}
			
			for ( var i = eachBlock_0_value.length; i < eachBlock_0_iterations.length; i += 1 ) {
				eachBlock_0_iterations[i].teardown( true );
			}
			
			eachBlock_0_anchor.parentNode.insertBefore( eachBlock_0_fragment, eachBlock_0_anchor );
			eachBlock_0_iterations.length = eachBlock_0_value.length;
		},

		teardown: function ( detach ) {
			if ( detach ) table.parentNode.removeChild( table );
			
			
			
			
			
			
			
			
			
			
			
			
			
			for ( var i = 0; i < eachBlock_0_iterations.length; i += 1 ) {
				eachBlock_0_iterations[i].teardown( false );
			}
		}
	};
}

function renderEachBlock_0 ( root, eachBlock_0_value, file, file__index, component, target ) {
	var tr = document.createElement( 'tr' );
	
	var td = document.createElement( 'td' );
	
	var a = document.createElement( 'a' );
	a.href = file.url;
	
	var text = document.createTextNode( file.name );
	a.appendChild( text );
	
	td.appendChild( a )
	
	tr.appendChild( td )
	
	var td1 = document.createElement( 'td' );
	
	var text1 = document.createTextNode( file.type );
	td1.appendChild( text1 );
	
	tr.appendChild( td1 )
	
	var td2 = document.createElement( 'td' );
	
	var text2 = document.createTextNode( template.helpers.format_size(file.size) );
	td2.appendChild( text2 );
	
	tr.appendChild( td2 )
	
	target.appendChild( tr )

	return {
		update: function ( changed, root, eachBlock_0_value, file, file__index ) {
			var file = eachBlock_0_value[file__index];
			
			a.href = file.url;
			
			text.data = file.name;
			
			text1.data = file.type;
			
			text2.data = template.helpers.format_size(file.size);
		},

		teardown: function ( detach ) {
			if ( detach ) tr.parentNode.removeChild( tr );
			
			
			
			
			
			
			
			
		}
	};
}

function FileTable ( options ) {
	var component = this;
	var state = options.data || {};

	var observers = {
		immediate: Object.create( null ),
		deferred: Object.create( null )
	};

	var callbacks = Object.create( null );

	function dispatchObservers ( group, newState, oldState ) {
		for ( var key in group ) {
			if ( !( key in newState ) ) continue;

			var newValue = newState[ key ];
			var oldValue = oldState[ key ];

			if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

			var callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( var i = 0; i < callbacks.length; i += 1 ) {
				var callback = callbacks[i];
				if ( callback.__calling ) continue;

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}

	this.fire = function fire ( eventName, data ) {
		var handlers = eventName in callbacks && callbacks[ eventName ].slice();
		if ( !handlers ) return;

		for ( var i = 0; i < handlers.length; i += 1 ) {
			handlers[i].call( this, data );
		}
	};

	this.get = function get ( key ) {
		return key ? state[ key ] : state;
	};

	this.set = function set ( newState ) {
		var oldState = state;
		state = Object.assign( {}, oldState, newState );
		
		dispatchObservers( observers.immediate, newState, oldState );
		if ( mainFragment ) mainFragment.update( newState, state );
		dispatchObservers( observers.deferred, newState, oldState );
	};

	this.observe = function ( key, callback, options ) {
		var group = ( options && options.defer ) ? observers.deferred : observers.immediate;

		( group[ key ] || ( group[ key ] = [] ) ).push( callback );

		if ( !options || options.init !== false ) {
			callback.__calling = true;
			callback.call( component, state[ key ] );
			callback.__calling = false;
		}

		return {
			cancel: function () {
				var index = group[ key ].indexOf( callback );
				if ( ~index ) group[ key ].splice( index, 1 );
			}
		};
	};

	this.on = function on ( eventName, handler ) {
		var handlers = callbacks[ eventName ] || ( callbacks[ eventName ] = [] );
		handlers.push( handler );

		return {
			cancel: function () {
				var index = handlers.indexOf( handler );
				if ( ~index ) handlers.splice( index, 1 );
			}
		};
	};

	this.teardown = function teardown ( detach ) {
		this.fire( 'teardown' );

		mainFragment.teardown( detach !== false );
		mainFragment = null;

		state = {};
	};

	var mainFragment = renderMainFragment( state, this, options.target );
}

return FileTable;

}());