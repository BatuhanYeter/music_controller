import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import { useHistory } from "react-router";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

const Room = ({ leaveRoomCallback }) => {
  const params = useParams();
  const history = useHistory();
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [isHost, setIsHost] = useState(false);
  const [settings, setSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});
  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentSong();
    }, 1000);
    return () => clearInterval(interval);
  }, [song]);
  const authenticateSpotify = () => {
    fetch("/spotify/is_authenticated")
      .then((res) => res.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get_auth_url")
            .then((res) => res.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };
  const getCurrentSong = () => {
    fetch("/spotify/current_song")
      .then((res) => {
        if (!res.ok) {
          return {};
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setSong(data);
        console.log(data);
      });
  };
  const fetchData = () => {
    const res = fetch("/api/get_room" + "?code=" + params.roomCode)
      .then((res) => {
        if (!res.ok) {
          leaveRoomCallback();
          history.push("/");
        }
        return res.json();
      })
      .then((data) => {
        setGuestCanPause(data.guest_can_pause);
        setVotesToSkip(data.votes_to_skip);
        setIsHost(data.is_host);
      });

    if (isHost) {
      authenticateSpotify();
    }
    // we want to authenticate after the data is set
  };
  fetchData();

  const leaveTheRoom = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave_room", requestOptions).then((_response) => {
      leaveRoomCallback();
      history.push("/");
    });
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1} align="center">
        <Grid item xs={12}>
          <CreateRoomPage
            update={true}
            votesToSkipP={votesToSkip}
            guestCanPauseP={guestCanPause}
            roomCode={params.roomCode}
          ></CreateRoomPage>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  return settings ? (
    renderSettings()
  ) : (
    <Grid container spacing={1} align="center">
      <Grid item xs={12}>
        <Typography variant="h6" component="h6">
          Code: {params.roomCode}
        </Typography>
      </Grid>
      {song != {} ? <MusicPlayer {...song} /> : null}
      {/* This may be hacked by someone but the backend has extra security check for host */}
      {isHost ? renderSettingsButton() : null}
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={leaveTheRoom}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;
