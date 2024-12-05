import React, { useContext, useRef } from 'react';
import { WardrobeContext } from "../context/WardrobeContext.tsx";

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { TextureLoader } from 'three';
import { Mesh } from 'three';
import * as THREE from 'three';

import backTextureUrl from "../assets/textures/8477.jpg"
import doorTextureUrl from "../assets/textures/6464.jpg";
import handlesTextureUrl from "../assets/textures/101853.jpg";

const Wardrobe = () => {
    const { isLoading} = useContext(WardrobeContext);

    const leftDoorRef = useRef<Mesh>(null);
    const rightDoorRef = useRef<Mesh>(null);
    const leftHandleRef = useRef<Mesh>(null);
    const rightHandleRef = useRef<Mesh>(null);

    const doorTexture = useLoader(TextureLoader, doorTextureUrl);
    const handlesTexture = useLoader(TextureLoader, handlesTextureUrl);
    const backTexture = useLoader(TextureLoader, backTextureUrl);

    // Configure texture properties
    backTexture.wrapS = backTexture.wrapT = THREE.RepeatWrapping;
    backTexture.repeat.set(1, 1);

    doorTexture.wrapS = doorTexture.wrapT = THREE.RepeatWrapping;
    doorTexture.repeat.set(-1, 1);

    handlesTexture.wrapS = handlesTexture.wrapT = THREE.RepeatWrapping;
    handlesTexture.repeat.set(1, 1);

    useFrame(() => {
        const leftDoor = leftDoorRef.current;
        const rightDoor = rightDoorRef.current;
        const leftHandle = leftHandleRef.current;
        const rightHandle = rightHandleRef.current;

        if (leftDoor && rightDoor && leftHandle && rightHandle) {
            const openAngle = Math.PI / 2; // 90 degrees

            // Smooth interpolation for opening/closing
            const targetLeftRotation = isLoading ? 0 : -openAngle; // Close if loading, open otherwise
            const targetRightRotation = isLoading ? 0 : openAngle;

            // Smooth doors rotation
            leftDoor.rotation.y = THREE.MathUtils.lerp(
                leftDoor.rotation.y,
                targetLeftRotation,
                0.05 // Smoothing factor
            );
            rightDoor.rotation.y = THREE.MathUtils.lerp(
                rightDoor.rotation.y,
                targetRightRotation,
                0.05 // Smoothing factor
            );

            // Rotate handles with doors
            leftHandle.rotation.y = leftDoor.rotation.y;
            rightHandle.rotation.y = rightDoor.rotation.y;
        }
    });

    return (
        <group>
            {/* Wardrobe body */}
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[3, 3, 1]} />
                <meshStandardMaterial
                    map={backTexture}
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh>

            {/* Left Door */}
            <mesh
                ref={leftDoorRef}
                position={[-1.5, 1.5, 0.51]}
                rotation={[0, 0, 0]}
            >
                <boxGeometry args={[2.99, 3, 0.1]} />
                <meshStandardMaterial
                    map={doorTexture}
                    roughness={0.7}
                    metalness={0.1}
                />

                {/* Left Door Handle */}
                <mesh
                    ref={leftHandleRef}
                    position={[1, 0, 0.1]}
                    rotation={[0, 0, Math.PI / 2]}
                >
                    <cylinderGeometry args={[0.05, 0.05, 0.2, 32]} />
                    <meshStandardMaterial
                        map={handlesTexture}
                        roughness={0.3}
                        metalness={0.9}
                    />
                </mesh>
            </mesh>

            {/* Right Door */}
            <mesh
                ref={rightDoorRef}
                position={[1.5, 1.5, 0.51]}
                rotation={[0, 0, 0]}
            >
                <boxGeometry args={[2.99, 3, 0.1]} />
                <meshStandardMaterial
                    map={doorTexture}
                    roughness={0.7}
                    metalness={0.1}
                />

                {/* Right Door Handle */}
                <mesh
                    ref={rightHandleRef}
                    position={[-1, 0, 0.1]}
                    rotation={[0, 0, Math.PI / 2]}
                >
                    <cylinderGeometry args={[0.05, 0.05, 0.2, 32]} />
                    <meshStandardMaterial
                        map={handlesTexture}
                        roughness={0.3}
                        metalness={0.9}
                    />
                </mesh>
            </mesh>
        </group>
    );
};

const WardrobeScene: React.FC = () => {
    return (
        <div className="w-11/12 mx-auto h-screen bg-secondary overflow-hidden rounded-3xl">
            <Canvas
                className="w-full h-full bg-secondary"
                gl={{ antialias: true }}
            >
                {/* Fixed camera setup */}
                <PerspectiveCamera
                    makeDefault
                    position={[0, 1.5, 5]}
                    fov={24}
                />

                {/* Lighting */}
                <ambientLight intensity={0.7} />
                <pointLight position={[3, 3, 5]} intensity={10} />
                <pointLight position={[-3, 3, 5]} intensity={5} />

                <Wardrobe />
            </Canvas>
        </div>
    );
};

export default WardrobeScene;