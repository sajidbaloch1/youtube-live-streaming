import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';


const CreateLiveBroadcast = () => {
    const [accessToken, setAccessToken] = useState('');
    const [stream, setStream] = useState(null);
    const [liveBroadcastId, setLiveBroadcastId] = useState(null);

    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(stream);
            createLiveBroadcast(stream);
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    }

    const createLiveBroadcast = async (stream) => {
        try {
            const requestBody = {
                snippet: {
                    title: 'My Live Broadcast',
                    description: 'Description of my live broadcast',
                },
                status: {
                    privacyStatus: 'public'
                }
            };

            const url = `https://www.googleapis.com/youtube/v3/liveBroadcasts?access_token=${accessToken}&part=id%2Csnippet%2Cstatus`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();
                setLiveBroadcastId(data.id);
                startLiveStream(stream, data.id);
                console.log('Live broadcast created:', data);
                alert('Live broadcast created successfully!');
            } else {
                console.error('Failed to create live broadcast:', response.status);
                alert('Failed to create live broadcast. Please try again.');
            }
        } catch (error) {
            console.error('Error creating live broadcast:', error);
            alert('An error occurred while creating the live broadcast.');
        }
    };

    const startLiveStream = async (stream, broadcastId) => {
        try {
            const constraints = {
                audio: true,
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user' // Or 'environment' for rear camera
                }
            };

            const webcamStream = new MediaStream();
            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];
            webcamStream.addTrack(videoTrack);
            webcamStream.addTrack(audioTrack);

            const webcamVideoElement = document.createElement('video');
            webcamVideoElement.srcObject = webcamStream;
            webcamVideoElement.play();

            const rtcPeerConnection = new RTCPeerConnection();
            rtcPeerConnection.addStream(webcamStream);

            const offer = await rtcPeerConnection.createOffer();
            await rtcPeerConnection.setLocalDescription(offer);

            const requestBody = {
                snippet: {
                    liveBroadcastContent: 'live',
                    title: 'My Live Broadcast',
                    description: 'Description of my live broadcast',
                },
                status: {
                    privacyStatus: 'public'
                }
            };

            const liveBroadcastUrl = `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,status&access_token=${accessToken}`;
            const liveStreamUrl = `https://www.googleapis.com/youtube/v3/liveStreams?part=snippet,status&access_token=${accessToken}`;

            const liveBroadcastResponse = await fetch(liveBroadcastUrl, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const liveBroadcastData = await liveBroadcastResponse.json();
            const liveBroadcastId = liveBroadcastData.id;

            const liveStreamRequestBody = {
                snippet: {
                    title: 'My Live Stream',
                    description: 'Description of my live stream'
                },
                cdn: {
                    frameRate: 'variable',
                    ingestionType: 'rtmp',
                    resolution: 'variable'
                },
                status: {
                    streamStatus: 'active'
                }
            };

            const liveStreamResponse = await fetch(liveStreamUrl, {
                method: 'POST',
                body: JSON.stringify(liveStreamRequestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const liveStreamData = await liveStreamResponse.json();
            const liveStreamId = liveStreamData.id;

            const liveBroadcastStreamUrl = `https://www.googleapis.com/youtube/v3/liveBroadcasts/bind?id=${liveBroadcastId}&part=id,snippet,contentDetails,status&streamId=${liveStreamId}&access_token=${accessToken}`;

            const liveBroadcastStreamResponse = await fetch(liveBroadcastStreamUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (liveBroadcastStreamResponse.ok) {
                console.log('Live stream started successfully!');
            } else {
                console.error('Failed to start live stream:', liveBroadcastStreamResponse.status);
            }
        } catch (error) {
            console.error('Error starting live stream:', error);
        }
    };
    const oauthSignIn = () => {
        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
        const params = {
            'client_id': '418999650850-9i9gl4rhgqopqpfhsq2kpo6of35360hu.apps.googleusercontent.com',
            'redirect_uri': 'http://localhost:3000',
            'response_type': 'token',
            'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
            'include_granted_scopes': 'true',
            'state': 'pass-through value'
        };
        const queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
        window.location.href = oauth2Endpoint + '?' + queryString;
    };

    useEffect(() => {
        const getAccessTokenFromURL = () => {
            const params = new URLSearchParams(window.location.hash.slice(1));
            setAccessToken(params.get('access_token'));
        };
        getAccessTokenFromURL();
    }, []);

    return (
        <div>
            <h2>Create Live Broadcast</h2>
            <Webcam audio={true} video={true} />
            <button onClick={startStream}>Start Live Broadcast</button>

            <button onClick={oauthSignIn}>Sign In with Google</button>

        </div>
    );
};

export default CreateLiveBroadcast;
