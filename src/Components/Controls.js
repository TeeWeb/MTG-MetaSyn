import React, { useRef, useState, useEffect } from "react";
import { useThree, useFrame, extend } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

const Controls = ({ selectedCard }) => {
  const { camera, gl } = useThree();
  const orbitRef = useRef();
<<<<<<< HEAD
  const [cardInFocus, setCardInFocus] = useState([0, 0, 0]);
  camera.up.set(0, 1, 0);
  camera.focus = 0;
=======
  camera.position.set(0, 100, 150);
>>>>>>> f7789095c4298428e90baad69b5397b6e4f544f9
  camera.aspect = window.innerWidth / window.innerHeight;

  useEffect(() => {
    console.log(camera, camera.getWorldDirection);
    if (selectedCard) {
      setCardInFocus(selectedCard);
    }
    camera.position.set(
      cardInFocus[0],
      cardInFocus[1] + 100,
      cardInFocus[2] + 125
    );
  }, [selectedCard]);

  console.log("cardInFocus Position: ", cardInFocus);

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
