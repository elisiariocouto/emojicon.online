export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return handleSvg(request, env, ctx);
	},
};

async function handleSvg(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url)
	const path = url.pathname.toLowerCase()
	const params = url.searchParams
	const emoji = params.get('emoji') || '🌍'
	const color = params.get('color') || 'skyblue'

	if (path === '/svg') {
		return serveSvg(emoji, color)
	} else if (path === '/') {
		return serveHtml(emoji, color)
	} else {
		return serveNotFound()
	}
}

function serveSvg(emoji: string, color: string): Response {
	const faviconSVG = generateFaviconSVG(emoji, color)

	return new Response(faviconSVG, {
		headers: { 'Content-Type': 'image/svg+xml' },
	})
}

function serveHtml(emoji: string, color: string): Response {
	const faviconSVG = generateFaviconSVG(emoji, color)
	const htmlResponse = generateHtmlResponse(emoji, color, faviconSVG)

	return new Response(htmlResponse, {
		headers: { 'Content-Type': 'text/html' },
	})
}

function serveNotFound(): Response {
	return new Response('🕵🏻‍♂️ 404 Not Found', { status: 404 })
}

function generateFaviconSVG(emoji: string, color: string): string {
	// count the number of characters in the emoji
	const emojiLength = [...emoji].length

	// if the emoji is a single character, then we can use a bigger font size
	const fontSize = emojiLength === 1 ? 50 : 40
	return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" style="background-color:${color};"><text x="50%" y="50%" font-size="${fontSize}" dominant-baseline="middle" text-anchor="middle">${emoji}</text></svg>`
}

function generateHtmlResponse(emoji: string, color: string, faviconSVG: string): string {

	return `
	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<link rel="icon" href="https://emojicon.online/svg?emoji=${encodeURIComponent('🤓🌍')}&color=skyblue" type="image/svg+xml">
			<title>Emojicon Online</title>
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
		</head>
		<body>
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				<div class="container">
					<a class="navbar-brand" href="/">Emojicon Online</a>
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarNav">
						<ul class="navbar-nav ms-auto">
							<li class="nav-item">
								<a class="nav-link active" href="/">Home</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="/svg?emoji=${encodeURIComponent(emoji)}&color=${encodeURIComponent(color)}">Generate Favicon</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<div class="container my-5">
				<div class="row mt-4">
						<div class="col-md-6 offset-md-3">
								<div class="card">
										<div class="card-body">
												<h2 class="card-title">Generated Favicon:</h2>
												<div class="text-center mb-4">
														${faviconSVG}
												</div>
										</div>
								</div>
						</div>
				</div>
				<div class="row mt-4">
					<div class="col-md-6 offset-md-3">
						<div class="card">
							<div class="card-body">
								<h2 class="card-title">Include this code in your website:</h2>
								<pre><code>&lt;link rel="icon" href="https://emojicon.online/svg?emoji=${encodeURIComponent(emoji)}&color=${encodeURIComponent(color)}" type="image/svg+xml"&gt;</code></pre>
							</div>
						</div>
					</div>
				</div>
			</div>
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
		</body>
	</html>
	`
}
