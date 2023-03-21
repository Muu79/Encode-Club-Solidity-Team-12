'use client';
import Image from 'next/image';
import styles from './page.module.css';
import {
	CubeCamera,
	Environment,
	OrbitControls,
	PerspectiveCamera,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
	EffectComposer,
	DepthOfField,
	Bloom,
	ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense } from 'react';
import { Boxes } from './Boxes';
import { Car } from './Car';
import { Ground } from './Ground';
import PropagateLoader from 'react-spinners/PropagateLoader';

function CarModel() {
	return (
		<>
			<OrbitControls target={[0, 0.35, 0]} maxPolarAngle={1.45} />
			{/* <PerspectiveCamera
				makeDefault
				fov={50}
				position={[3, 2, 5]}
				/> */}
			{/* <mesh>
				<boxGeometry args={[1, 1, 1]} />
				<meshBasicMaterial color={'red'} />
			</mesh> */}
			<color args={[0, 0, 0]} attach='background' />
			{/* <CubeCamera resoultion={256} frames={Infinity}>
				{(texture) => (
					<>
						<Environment map={texture} />
						
					</>
				)}
			</CubeCamera> */}

			<spotLight
				color={[1, 0.25, 0.7]}
				intensity={1.5}
				angle={0.6}
				penumbra={0.5}
				position={[5, 5, 0]}
				castShadow
				shadow-bias={-0.0001}
			/>
			<spotLight
				color={[0.14, 0.5, 1]}
				intensity={2}
				angle={0.6}
				penumbra={0.5}
				position={[-5, 5, 0]}
				castShadow
				shadow-bias={-0.0001}
			/>
			<Ground />
			<Car />
			<Boxes />
			<EffectComposer>
				<DepthOfField
					focusDistance={0.0035}
					focalLength={0.01}
					bokehScale={3}
					height={480}
				/>
				<Bloom
					blendFunction={BlendFunction.ADD}
					intensity={1.3} // The bloom intensity.
					width={300} // render width
					height={300} // render height
					kernelSize={5} // blur kernel size
					luminanceThreshold={0.15} // luminance threshold. Raise this value to mask out darker elements in the scene.
					luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
				/>
				<ChromaticAberration
					blendFunction={BlendFunction.NORMAL} // blend mode
					// offset={[0.0005, 0.0012]} // color offset
				/>
			</EffectComposer>
		</>
	);
}
export default function ThreePage({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Suspense
				fallback={
					<div className='bg-[#091B18] min-h-screen flex flex-col items-center text-center justify-center'>
						<div className='flex flex-col items-center mb-10'>
							<div className='flex items-center space-x-2'>
								<Image
									className={styles.logo}
									src='/Team.svg'
									alt='Team Logo'
									width={180}
									height={37}
									priority
								/>
								<div className={styles.thirteen}>
									<Image
										src='/twelve.svg'
										alt='12'
										width={40}
										height={31}
										priority
									/>
								</div>
							</div>
							<h1 className='text-6xl text-white font-bold'>Loading Models</h1>
							<h2 className='text-white'>Week-5 project</h2>
							<PropagateLoader color='white' size={30} />
						</div>
					</div>
				}
			>
				{children}
				<Canvas shadows>
					<CarModel />
				</Canvas>
			</Suspense>
		</div>
	);
}
