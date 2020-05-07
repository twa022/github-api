function getParamString( params ) {
	return '?' +  Object.keys( params ).map( key => key + '=' + params[key] ).join('&');
}

function getGithubUserRepos( username ) {
	const endpoint = 'https://api.github.com/users/';
	const params = { "type": "owner" };
	const url = endpoint + username.replace( '\ ', '%20') + '/repos' + getParamString( params );
	const headers = new Headers( { "Accept": "application/vnd.github.v3+json" } );
	fetch( url, headers )
	.then(
		response => { 
			if ( !response.ok ) {
				if ( String(response.status) === '404' ) {
					throw new Error( `No repos found for user ${username}`);
				}
				throw new Error( `Received ${response.status} error searching for repos for user ${username}` );
			}
			return response.json();
		}
	).then(
		responseJson => {
			$('.repo-list > ul').html( responseJson.map( repo => `<li class="repo-list-entry"><span class="repo-name">${repo.name}:</span> <a href="${repo.html_url}">${repo.html_url}</a></li>`).join('') );
			console.log( responseJson );
		}
	).catch( 
		error => $('.repo-list > ul').html( error )
	)
}

function submitHandler() {
	$('#gh-username-submit').click( function( event ) {
		event.preventDefault();
		const username = $('#gh-username').val();
		const repos = getGithubUserRepos( username );
	})
}

$(document).ready(
	() => {
		$(submitHandler);
	}
)