import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {Divider, Checkbox, Button} from "antd";
import FormModal from "../../molecules/QuestionFormModal";

import {getChapter} from "../../actions/chapter.actions";
import {addQuestion} from "../../actions/question.actions";

class Chapter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            questionModalIsOpen: false,
            correctAnswerIndex: null
        }
    }

    handleOptionChange = e => {
        this.setState({value: e.target.checked ? e.target.value : null });
    };

    handleAddQuestion = e => {
        this.setState({questionModalIsOpen: true});
    };

    handleSubmit = (form, files, options) => {
        let formOptions = [];
        const {courseId} = this.props.match.params;
        for (let i = 0; i < options.length; i++) {
            formOptions.push({value: form[options[i].name], name: options[i].name});
        }

        const data = {
            formOptions,
            question: form.question,
            files,
            correctAnswerIndex: this.state.correctAnswerIndex
        };
        const {chapterId} = this.props.chapter;
        this.props.addQuestion(data, {chapterId, courseId});
        this.setState({questionModalIsOpen: false});
    };

    handleCorrectAnswerChange = (value) => {
        this.setState({correctAnswerIndex: value});
    };

    handleClose = () => {
        this.setState({questionModalIsOpen: false});
    };

    componentDidMount = () => {
        const {chapterId} = this.props.match.params;
        this.props.getChapter(chapterId);
    };

    render() {
        const {questions} = this.props;
        const Questions = questions.map((question, index) => {
            return (
                <div key={question.questionId}>
                    <div><b>{index+1}. </b><b>{question.question}</b></div>

                    {question.Media.map((media) => {
                        return (
                            <div key={media.mediaId}>
                                <img src={media.url} alt="" style={{height: '50px', width: '50px', objectFit: 'cover'}}/>
                            </div>
                        )
                    })}

                    {question.answers.map((answer) => {
                        return (
                            <div key={answer.answerId}>
                                <Checkbox
                                    indeterminate={this.state.indeterminate}
                                    onChange={this.handleOptionChange}
                                    checked={this.state.value === "One"}
                                    value={"One"}
                                >
                                    {answer.answer}
                                </Checkbox>

                                {answer.Media.map((media) => {
                                    return (
                                        <div key={media.mediaId}>
                                            <img src={media.url} alt="" style={{height: '50px', width: '50px', objectFit: 'cover'}}/>
                                        </div>
                                    )
                                })}

                            </div>
                        )
                    })}
                    <Divider />
                </div>
            )
        });

        return (
            <div style={{margin: '0 40px'}}>
                <Divider>Chapter</Divider>
                <div className="right-align">
                    <Button onClick={this.handleAddQuestion} type="primary" icon="plus" size="large">
                        Add Question
                    </Button>
                </div>
                <div className="left-align">
                    {Questions}
                </div>

                <FormModal
                    title={"Add Question"}
                    handleSubmit={this.handleSubmit}
                    handleClose={this.handleClose}
                    isOpen={this.state.questionModalIsOpen}
                    handleCorrectAnswerChange={this.handleCorrectAnswerChange}
                />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getChapter,
        addQuestion
    }, dispatch);
}

function mapStateToProps(state)
{
    return {
        loading: state.course.loading,
        chapter: state.course.activeChapter,
        questions: state.course.chapterQuestions,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chapter);