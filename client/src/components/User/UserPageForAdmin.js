import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from 'react-select';
import { userDelete, userModify } from '../../actions/usersActions';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import UpdateIcon from '@material-ui/icons/Update';

const UserPageForAdmin = (props) => {
  const [userRole, setUserRole] = useState('');
  const [userEditWasSuccessful, setUserEditWasSuccessful] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (props.user) {
      setUserName(props.user.name);
    }
    setUserRole(getDefaultSelectRole);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getRoleSelectionOptions = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Shopkeeper' },
    { value: 3, label: 'Customer' },
  ];

  const getDefaultSelectRole = props.user
    ? getRoleSelectionOptions.filter(
        (option) => option.value === parseInt(props.user.role, 10)
      )[0]
    : '';

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handleUserPasswordChange = (e) => {
    setUserPassword(e.target.value);
  };

  const renderRoleSelection = () => {
    return (
      <div className="userRoleSelection" style={{ width: '150px' }}>
        <Select
          className="userRoleSelection"
          value={userRole}
          onChange={(role) => setUserRole(role)}
          options={getRoleSelectionOptions}
        />
      </div>
    );
  };

  const deleteUser = () => {
    props.delete(props.user);
  };

  const setNewValuesToUser = () => {
    const modifiedUser = {
      id: props.user.id,
      name: userName,
      password: userPassword,
      token: props.user.token,
      role: userRole.value,
    };
    props.modify(modifiedUser);
    setUserRole(userRole);
    setUserEditWasSuccessful(true);
  };

  return props.isLoading ? (
    <CircularProgress color="secondary" />
  ) : (
    <Box className="addItemBox">
      <Typography variant="h2">Edit user</Typography>
      {userEditWasSuccessful && (
        <>
          User edited succesfully
          <br />
        </>
      )}
      <form className="addItemBox">
        <TextField
          label="Name"
          type="text"
          name="name"
          minLength={1}
          maxLength={10}
          required
          value={userName}
          onChange={handleUserNameChange}
          on
        />
        <TextField
          label="Password"
          type="password"
          placeholder="*********"
          name="password"
          minLength={1}
          maxLength={10}
          required
          value={userPassword}
          onChange={handleUserPasswordChange}
          on
        />
        {renderRoleSelection()}
        <FormGroup row={true}>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={setNewValuesToUser}
            startIcon={<UpdateIcon />}
          >
            Modify
          </Button>
          <br />
          <Button
            type="button"
            color="primary"
            variant="outlined"
            onClick={deleteUser}
          >
            Delete
          </Button>
        </FormGroup>
      </form>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loginHasErrored: state.userLoginHasErrored,
    isLoading: state.userIsLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    delete: (user) => dispatch(userDelete(user)),
    modify: (user) => dispatch(userModify(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPageForAdmin);
