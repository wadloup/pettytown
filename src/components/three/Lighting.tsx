function Lighting() {
  return (
    <>
      <hemisphereLight args={["#B9E8FF", "#18072D", 1.15]} />
      <directionalLight
        castShadow
        position={[5, 9, 4]}
        intensity={1.6}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <ambientLight intensity={0.32} />
      <pointLight position={[-4.8, 2.4, 0.8]} color="#D946EF" intensity={4.2} distance={7} />
      <pointLight position={[4.9, 2.2, 0.4]} color="#22D3EE" intensity={3.8} distance={7} />
      <pointLight position={[0.2, 2.3, -4.7]} color="#7C3AED" intensity={4.4} distance={8} />
      <pointLight position={[0, 1.5, 0]} color="#F0ABFC" intensity={2.2} distance={5} />
    </>
  );
}

export default Lighting;
