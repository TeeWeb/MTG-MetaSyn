import React, { useRef, useState, useEffect } from "react";
import { useThree, useFrame, extend } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

const Controls = ({ selectedCard }) => {
  const { camera, gl } = useThree();
  const orbitRef = useRef();
  const [cardInFocus, setCardInFocus] = useState([0, 0, 0]);
  camera.up.set(0, 1, 0);
  camera.focus = 0;
  camera.aspect = window.innerWidth / window.innerHeight;

  useEffect(() => {
    if (selectedCard) {
      setCardInFocus(selectedCard);
    }
    camera.position.set(
      cardInFocus[0],
      cardInFocus[1] + 100,
      cardInFocus[2] + 125
    );
  }, [selectedCard]);

  // console.log("cardInFocus Position: ", cardInFocus);

  useFrame(() => {
    orbitRef.current.update();
    camera.lookAt(cardInFocus[0], cardInFocus[1], cardInFocus[2]);
  });

  return (
    <orbitControls
      args={[camera, gl.domElement]}
      ref={orbitRef}
      maxPolarAngle={Math.PI / 2.01}
      enableKeys={true}
      enablePanning={true}
      keys={{ LEFT: 65, UP: 87, RIGHT: 68, BOTTOM: 83 }}
    />
  );
};

export default Controls;
