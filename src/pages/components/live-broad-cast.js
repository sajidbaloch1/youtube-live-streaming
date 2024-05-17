import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const CameraComponent = ({ webcamRef }) => {
   ;

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                mirrored={true} // Set to true if you want the camera feed mirrored
                width={640}
                height={480}
            />
        </div>
    );
};

export default CameraComponent;
