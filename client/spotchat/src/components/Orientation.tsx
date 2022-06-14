import React from 'react';
import { Button, ButtonGroup, Dropdown, Form, InputGroup, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

class Orientation extends React.Component<{}, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('user')!),
            sex: ["Male", "Female", "Other"],
            gender: "",
            interestedIn: "",
            show: false,
            month: "",
            day: "",
            year: "",
            bio: "",
            profilePicture: null,
            profilePictureEncoded: "",

        }
        this.handleChangeGender = this.handleChangeGender.bind(this);
        this.handleChangePreference = this.handleChangePreference.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleProfilePictureChange = this.handleProfilePictureChange.bind(this);
    }

    handleModalOpen = () => {
        this.setState({ show: true });
    }

    handleModalClose = () => {
        this.setState({ show: false });
    }

    handleChangeGender(event: any) {
        this.setState({gender: event.target.id});
    }

    handleChangePreference(event: any) {
        this.setState({interestedIn: event.target.id});
    }

    handleMonthChange(event: any) {
        this.setState({month: event.target.id});
    }

    handleDayChange(event: any) {
        this.setState({day: event.target.id});
    }

    handleYearChange(event: any) {
        this.setState({year: event.target.id});
    }

    handleInputChange(event: any) {
        this.setState({bio: event.target.value});
    }

    handleProfilePictureChange(event: any) {
        this.setState({profilePicture: event.target.files[0]});
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            this.setState({profilePictureEncoded: reader.result});
        }
        reader.readAsDataURL(file);
        console.log(this.state.profilePictureEncoded);
    }

    async handleSubmit(event: any) {
        console.log(this.state)
        const birthday = new Date(`${this.state.month} ${this.state.day}, ${this.state.year}`);
        if (this.state.gender !== "" && this.state.interestedIn !== ""
        && this.state.month !== "" && this.state.day !== "" && this.state.year !== ""
        && this.state.bio !== "" && this.state.profilePictureEncoded !== "") {
            await axios.patch("http://localhost:8080/users", {
                userId: this.state.user.userId,
                sex: this.state.gender,
                interestedIn: this.state.interestedIn,
                birthday: birthday,
                bio: this.state.bio,
                profilePicture: this.state.profilePictureEncoded
            });
            localStorage.setItem("userDetails", "true");
            axios.get("http://localhost:8080/users/" + this.state.user.userId).then(res => {
                localStorage.setItem("user", JSON.stringify(res.data));
                window.location.href = "/home";
            });
        } else {
            this.handleModalOpen()
        }

    }

    render() {
        const user: any = localStorage.getItem("user");
        if (user.sex !== "") {
            window.location.href = "/home";
        }
        const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return(
            <div>
                <h1>First lets get you set up</h1>
                <h6>When is your birthday?</h6>
                <ButtonGroup>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.month === "" ? "Month" : this.state.month}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{maxHeight:"300px", overflowY:"auto"}}>
                            {monthsOfYear.map((month: string, index: number) => {
                                return <Dropdown.Item key={index} id={month} onClick={this.handleMonthChange}>{month}</Dropdown.Item>
                            }
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.day === "" ? "Day" : this.state.day}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{maxHeight:"300px", overflowY:"auto"}}>
                            {[...Array(31)].map((x, i) => <Dropdown.Item key={i} id={(i+1).toString()} onClick={this.handleDayChange}>{i + 1}</Dropdown.Item>)}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.year === "" ? "Year" : this.state.year}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{maxHeight:"300px", overflowY:"auto"}}>
                            {[...Array(105)].map((x, i) => <Dropdown.Item key={i} id={(i+1940).toString()} onClick={this.handleYearChange}>{i + 1940}</Dropdown.Item>)}
                        </Dropdown.Menu>
                    </Dropdown>
                </ButtonGroup>
                <Form>
                    <h6>What is your sex?</h6>
                    {this.state.sex.map((type: string) => (
                        <div key={`default-${type}`} className="mb-3">
                        <Form.Check 
                            type="radio"
                            id={type}
                            name="sex group"
                            label={type}
                            onChange={this.handleChangeGender}
                        />
                        </div>
                    ))}
                    <h6>What is your sexual preference?</h6>
                    {this.state.sex.map((type: string) => (
                        <div key={`default-${type}`} className="mb-3">
                        <Form.Check 
                            type="radio"
                            id={type}
                            name="perference group"
                            label={type}
                            onChange={this.handleChangePreference}
                        />
                        </div>
                    ))}
                    <h6>Short Bio to describe yourself:</h6>
                    <InputGroup>
                        <Form.Control as="textarea" aria-label="With textarea" placeholder="Max 200 characters" maxLength={200} onChange={this.handleInputChange}/>
                    </InputGroup>
                    <div>
                        <h6>Profile picture:</h6>
                        <input id="input-file-1" name="input-file-1[]" multiple type="file" accept="image/*" onChange={this.handleProfilePictureChange}></input>
                        <img src={this.state.profilePicture === null ? "https://via.placeholder.com/200" : URL.createObjectURL(this.state.profilePicture)} alt="profile picture" style={{width: "200px", height: "200px"}}></img>
                    </div>
                    <Button variant="primary" onClick={this.handleSubmit}>Submit</Button>
                    <Modal show={this.state.show} onHide={this.handleModalClose}>
                        <Modal.Title>Error</Modal.Title>
                        <Modal.Body>Please select all options</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleModalClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Form>        
            </div>
        )
    }
}
export default Orientation