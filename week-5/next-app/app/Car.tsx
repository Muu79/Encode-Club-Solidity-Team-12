import { useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh } from 'three';

export function Car() {
	const gltf = useLoader(GLTFLoader, '/car/scene.gltf');

	useEffect(() => {
		gltf.scene.scale.set(1, 1, 1);
		gltf.scene.position.set(0.05, -0.035, 1);
		gltf.scene.rotation.set(0, 1, 0);
		gltf.scene.traverse((object: any) => {
			if (object instanceof Mesh) {
				object.castShadow = true;
				object.receiveShadow = true;
				object.material.envMapIntensity = 20;
			}
		});
	}, [gltf]);

	//useFrame((state, delta) => {
	//	let t = state.clock.getElapsedTime();
	//
	//	let group = gltf.scene.children[0].children[0].children[0];
	//	group.children[0].rotation.x = t * 2;
	//	group.children[2].rotation.x = t * 2;
	//	group.children[4].rotation.x = t * 2;
	//	group.children[6].rotation.x = t * 2;
	//});

	return <primitive object={gltf.scene} />;
}
