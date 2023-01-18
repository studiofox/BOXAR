
	const scene = new THREE.Scene();

	const ambientLight = new THREE.AmbientLight( 0xcccccc, 1.0 );
	scene.add( ambientLight );
				
	const camera = new THREE.Camera();
	// camera.aspect = window.innerWidth / window.innerHeight;


	

	const renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
// 	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
// 	// renderer.setSize( 1280, 960 );
	renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );

	const clock = new THREE.Clock();
	let deltaTime = 0;
	let totalTime = 0;
	
	

	const arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize()
	{
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}

	arToolkitSource.init(function onReady(){
		onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize()
	});
	


	// create atToolkitContext
	const arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'camera_para.dat',
		detectionMode: 'mono'
	});
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init( function onCompleted(){
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});


	// build markerControls
	const markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "kanji.patt",
	})


	function onProgress(xhr) { console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); }
	function onError(xhr) { console.log( 'An error happened' ); }
	

const assetLoader = new THREE.GLTFLoader();

assetLoader.load("model.glb", function (gltf) {
  const model = gltf.scene;
  markerRoot1.add(model);
//   model.position.set(-12, -50, -100);
  model.scale.set(0.7, 0.7, 0.7);

  model.traverse(function(node) {
    if(node.isMesh)
    {node.castShadow = true;}
  });
});

const arlight = new THREE.AmbientLight();
markerRoot1.add(arlight);

// const drlight = new THREE.DirectionalLight(0xffffff, 5);
// markerRoot1.add(drlight);



function update()
{
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
}

const sizes = { width: window.innerWidth, height: window.innerHeight };
window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	// Update camera
	camera.aspect = sizes.width / sizes.height;
	// camera.updateProjectionMatrix();
	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });


function render()
{
	renderer.render( scene, camera );
}


function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}

animate();