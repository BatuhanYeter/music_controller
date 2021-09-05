import React from "react";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import {
  Typography,
  TextField,
  FormHelperText,
  FormControl,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import { useState } from "react";
import { useHistory } from "react-router";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const CreateRoomPage = ({ votesToSkipP, update, guestCanPauseP, roomCode }) => {
  const history = useHistory();

  const [guestCanPause, setGuestCanPause] = useState(
    guestCanPauseP != null ? guestCanPauseP : false
  );
  const [votesToSkip, setVotesToSkip] = useState(
    votesToSkipP != null ? votesToSkipP : 2
  );
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const handleRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch("/api/create_room", requestOptions)
      .then((response) => response.json())
      .then((data) => history.push("/room/" + data.code));
  };
  const handleUpdateButton = () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      }),
    };
    fetch("/api/update_room", requestOptions).then((response) => {
      if (response.ok) {
        setSuccessMsg("Room updated successfully!");
      } else {
        setErrorMsg("Error updating room...");
      }
    });
  };
  const backButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    );
  };
  const title = update ? `Update Room: ${roomCode}` : "Create a Room";

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg != "" || successMsg != ""}>
          {successMsg != "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setSuccessMsg("");
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMsg("");
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText component="div">
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup row defaultValue="true">
            <FormControlLabel
              value={update ? `${guestCanPause}` : "true"}
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
              onClick={() => setGuestCanPause(true)}
            />
            <FormControlLabel
              value={update ? `${!guestCanPause}` : "false"}
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
              onClick={() => setGuestCanPause(false)}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            defaultValue={update ? votesToSkip : 2}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
            onChange={(e) => setVotesToSkip(parseInt(e.target.value))}
          />
          <FormHelperText component="div">
            <div align="center">Votes required to skip the song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={update ? handleUpdateButton : handleRoomButtonPressed}
        >
          {update ? "Update" : "Create a Room"}
        </Button>
      </Grid>
      {update ? null : backButton()}
    </Grid>
  );
};

export default CreateRoomPage;
