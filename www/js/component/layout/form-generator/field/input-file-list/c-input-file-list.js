// @flow

import React, {Component, type Node} from 'react';
import classNames from 'classnames';

import type {InputComponentPropsType, FromGeneratorPrimitiveInputValueType} from '../../type';
import fieldStyle from '../field.style.scss';
import {isFile, isNull, isString} from '../../../../../lib/is';
import serviceStyle from '../../../../../../css/service.scss';

import inputFileListStyle from './input-file-list.style.scss';

type PropsType = InputComponentPropsType;
type StateType = {fileList: Array<File>};

export class InputFileList extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            fileList: [],
        };
    }

    getValue(evt: SyntheticEvent<HTMLInputElement>): Array<File> {
        const {currentTarget} = evt;
        const {files} = currentTarget;

        const fileList: Array<File> = [];

        [...files].forEach((value: FromGeneratorPrimitiveInputValueType) => {
            if (isFile(value)) {
                fileList.push(value);
            }
        });

        return fileList;
    }

    handleOnChange = (evt: SyntheticEvent<HTMLInputElement>) => {
        const {props, state} = this;
        const {onChange} = props;
        const fileList = this.getValue(evt);

        onChange(fileList);

        this.setState({fileList});
    };

    handleOnBlur = (evt: SyntheticEvent<HTMLInputElement>) => {
        const {props, state} = this;
        const {onBlur} = props;
        const fileList = this.getValue(evt);

        onBlur(fileList);

        this.setState({fileList});
    };

    renderFileListStateLabel(): Node {
        const {state} = this;
        const {fileList} = state;
        const fileCount = fileList.length;
        const className = classNames(inputFileListStyle.file_input__text, serviceStyle.ellipsis);

        const fileNameHumanList
            = fileList
                .map((file: FromGeneratorPrimitiveInputValueType): string => {
                    if (isFile(file)) {
                        return file.name;
                    }
                    console.error('No file here!');
                    return 'WARNING: No file here!';
                })
                .join(', ') + '.';

        const message = fileCount > 0 ? `Files: ${fileCount}. ${fileNameHumanList}` : 'Click here or drop files.';

        return <span className={className}>{message}</span>;
    }

    render(): Node {
        const {props, state} = this;
        const {name, onChange, onBlur, errorList, defaultValue, placeholder, labelText, accept, isMultiple} = props;

        if (!Array.isArray(defaultValue) && !isNull(defaultValue)) {
            console.error('InputFileList: Support Array or Null Only');
            return null;
        }

        return (
            <label className={fieldStyle.form__label_wrapper}>
                <span className={fieldStyle.form__label_description}>{labelText}</span>
                <div
                    className={classNames(fieldStyle.form__input, inputFileListStyle.file_input__wrapper, {
                        [fieldStyle.form__input__invalid]: errorList.length > 0,
                    })}
                >
                    {this.renderFileListStateLabel()}
                    <input
                        accept={isString(accept) ? accept : '*/*'}
                        className={inputFileListStyle.file_input__input}
                        defaultValue={defaultValue}
                        key="file-input"
                        multiple={Boolean(isMultiple)}
                        name={name}
                        onBlur={this.handleOnBlur}
                        onChange={this.handleOnChange}
                        placeholder={placeholder}
                        type="file"
                    />
                </div>
            </label>
        );
    }
}
