import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const CreateLiveBroadcast = () => {
    const [accessToken, setAccessToken] = useState('');
    const [stream, setStream] = useState(null);
    const [liveBroadcastId, setLiveBroadcastId] = useState(null);
    const [ingestionInfo, setIngestionInfo] = useState(null);
    const [videoStreamURL, setVideoStreamURL] = useState(null);
    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(stream);
            createLiveBroadcast(stream); // Create live broadcast function call
        } catch (error) {
            console.error('Media devices access error:', error);
            alert('Camera aur microphone access nahi ho rahe. Properly connected aur accessible hone chahiye.');
        }
    };

    const createLiveBroadcast = async (stream) => {
        const now = new Date();
    

        try {
            const requestBody = {
                snippet: {
                    title: `New Video: ${new Date().toISOString()}`,
                    scheduledStartTime: `${new Date().toISOString()}`,
                    description:
                      'A description of your video stream. This field is optional.',
                  },
               
                  status: {
                    privacyStatus: 'public',
                    selfDeclaredMadeForKids: true,
                  },
            };

            const url = `https://www.googleapis.com/youtube/v3/liveBroadcasts?access_token=${accessToken}&part=id,snippet,status`;

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
                createLiveStream(data.id); // Create live stream function call
                console.log('Live broadcast created:', data);
                alert('Live broadcast successfully created!');
            } else {
                console.error('Failed to create live broadcast:', response.status);
                alert('Live broadcast create nahi hui. Dobara try karein.');
            }
        } catch (error) {
            console.error('Error creating live broadcast:', error);
            alert('Live broadcast create karne mein error hua.');
        }
    };

    const createLiveStream = async (broadcastId) => {
        try {
            const liveStreamRequestBody = {
                snippet: {
                    title: "Your new video stream's name",
                    description:
                      'A description of your video stream. This field is optional.',
                  },
                  cdn: {
                    frameRate: 'variable',
                    ingestionType: 'rtmp',
                    resolution: 'variable',
                    format: '',
                  },
                  status:{
                    streamStatus:'active',
                  }
                 
            };

            const liveStreamUrl = `https://www.googleapis.com/youtube/v3/liveStreams?access_token=${accessToken}&part=id,snippet,cdn,status`;

            const liveStreamResponse = await fetch(liveStreamUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(liveStreamRequestBody)
            });

            if (liveStreamResponse.ok) {
                const liveStreamData = await liveStreamResponse.json();
                setIngestionInfo(liveStreamData.cdn.ingestionInfo);
                bindBroadcastToStream(broadcastId, liveStreamData.id);
                console.log('Live stream created:', liveStreamData);
            } else {
                console.error('Failed to create live stream:', liveStreamResponse.status);
            }
        } catch (error) {
            console.error('Error creating live stream:', error);
        }
    };

    const bindBroadcastToStream = async (broadcastId, streamId) => {
        try {
            const url = `https://www.googleapis.com/youtube/v3/liveBroadcasts/bind?id=${broadcastId}&part=id,snippet,contentDetails,status&streamId=${streamId}&access_token=${accessToken}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Broadcast successfully bound to stream');
                // Delay the transition to live to ensure the stream is active
                setTimeout(() => transitionToLive(broadcastId), 60000); // 60 seconds delay
            } else {
                console.error('Failed to bind broadcast to stream:', response.status);
            }
        } catch (error) {
            console.error('Error binding broadcast to stream:', error);
        }
    };

    const transitionToLive = async (broadcastId) => {
        try {
            const url = `https://www.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=live&id=${broadcastId}&part=id,status&access_token=${accessToken}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Broadcast successfully transitioned to live');
            } else {
                console.error('Failed to transition broadcast to live:', response.status);
            }
        } catch (error) {
            console.error('Error transitioning broadcast to live:', error);
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