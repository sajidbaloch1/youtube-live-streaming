import React, { useEffect, useRef } from 'react';
import CameraComponent from './components/live-broad-cast';

const CreateLiveBroadcast = () => {
    const webcamRef = useRef(null);
    let accessToken = ''; // Initialize access token variable

    useEffect(() => {
        // Function to extract access token from URL parameters
        const getAccessTokenFromURL = () => {
            const params = new URLSearchParams(window.location.hash.slice(1));
            accessToken = params.get('access_token');
        };

        // Call the function to extract access token once component mounts
        getAccessTokenFromURL();
    }, []);

    const createLiveBroadcast = async () => {
        if (webcamRef.current) {
            const imageData = webcamRef.current.getScreenshot();
            var currentdate = new Date();
            var iso8601datetime = currentdate.toISOString();

            const requestBody = {
                snippet: {
                    title: 'Your Broadcast Title',
                    description: 'Your Broadcast Description',
                    scheduledStartTime: iso8601datetime, // Example start time (in ISO 8601 format)
                    // scheduledEndTime: '2024-05-17T13:00:00Z'    // Example end time (in ISO 8601 format)
                },
                status: {
                    privacyStatus: 'public' // Example privacy status ('public', 'private', 'unlisted')
                }
            };
            // API URL formation with corrected access token parameter
            const url = `https://www.googleapis.com/youtube/v3/liveBroadcasts?access_token=${accessToken}&part=id%2Csnippet%2Cstatus`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)

                });

                if (response.ok) {
                    const data = await response.json();
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
        } else {
            console.error('webcamRef is not initialized.');
        }
    };


    const oauthSignIn = () => {
        // Google's OAuth 2.0 endpoint for requesting an access token
        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

        // Parameters to pass to OAuth 2.0 endpoint.
        const params = {
            'client_id': '418999650850-9i9gl4rhgqopqpfhsq2kpo6of35360hu.apps.googleusercontent.com',
            'redirect_uri': 'http://localhost:3000',
            'response_type': 'token',
            'scope': 'https://www.googleapis.com/auth/youtube.force-ssl',
            'include_granted_scopes': 'true',
            'state': 'pass-through value'
        };

        // Convert params object into query string
        const queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');

        // Redirect the user to Google's OAuth 2.0 endpoint with the necessary parameters
        window.location.href = oauth2Endpoint + '?' + queryString;
    };
    return (
        <div>
            <h2>Create Live Broadcast</h2>
            <CameraComponent ref={webcamRef} />
            <button onClick={createLiveBroadcast}>Create Live Broadcast</button>
            <button onClick={oauthSignIn}>Sign In with Google</button>
        </div>
    );
};

export default CreateLiveBroadcast;
