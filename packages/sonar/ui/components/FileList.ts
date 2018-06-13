/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import {Component} from 'react';

const path = require('path');
const fs = require('fs');

const EMPTY_MAP = new Map();
const EMPTY_FILE_LIST_STATE = {error: null, files: EMPTY_MAP};

export type FileListFileType = 'file' | 'folder';

export type FileListFile = {|
  name: string,
  src: string,
  type: FileListFileType,
  size: number,
  mtime: number,
  atime: number,
  ctime: number,
  birthtime: number,
|};

export type FileListFiles = Array<FileListFile>;

type FileListProps = {
  src: string,
  onError?: ?(err: Error) => React$Node,
  onLoad?: () => void,
  onFiles: (files: FileListFiles) => React$Node,
};

type FileListState = {|
  files: Map<string, FileListFile>,
  error: ?Error,
|};

export default class FileList extends Component<FileListProps, FileListState> {
  constructor(props: FileListProps, context: Object) {
    super(props, context);
    this.state = EMPTY_FILE_LIST_STATE;
  }

  watcher: ?fs.FSWatcher;

  fetchFile(name: string): Promise<FileListFile> {
    return new Promise((resolve, reject) => {
      const loc = path.join(this.props.src, name);

      fs.lstat(loc, (err, stat) => {
        if (err) {
          reject(err);
        } else {
          const details: FileListFile = {
            atime: Number(stat.atime),
            birthtime:
              typeof stat.birthtime === 'object' ? Number(stat.birthtime) : 0,
            ctime: Number(stat.ctime),
            mtime: Number(stat.mtime),
            name,
            size: stat.size,
            src: loc,
            type: stat.isDirectory() ? 'folder' : 'file',
          };
          resolve(details);
        }
      });
    });
  }

  fetchFiles(callback?: Function) {
    const {src} = this.props;

    const setState = data => {
      if (!hasChangedDir()) {
        this.setState(data);
      }
    };

    const hasChangedDir = () => this.props.src !== src;

    fs.readdir(src, (err, files) => {
      if (err) {
        setState({error: err, files: EMPTY_MAP});
        return;
      }

      const filesSet: Map<string, FileListFile> = new Map();
      const next = () => {
        if (hasChangedDir()) {
          return;
        }

        if (!files.length) {
          setState({error: null, files: filesSet});
          if (callback) {
            callback();
          }
          return;
        }

        const name = files.shift();
        this.fetchFile(name)
          .then(data => {
            filesSet.set(name, data);
            next();
          })
          .catch(err => {
            setState({error: err, files: EMPTY_MAP});
          });
      };

      next();
    });
  }

  componentWillReceiveProps(nextProps: FileListProps) {
    if (nextProps.src !== this.props.src) {
      this.initialFetch(nextProps);
    }
  }

  componentDidMount() {
    this.initialFetch(this.props);
  }

  componentWillUnmount() {
    this.removeWatcher();
  }

  initialFetch(props: FileListProps) {
    this.removeWatcher();

    fs.access(props.src, fs.constants.R_OK, err => {
      if (err) {
        this.setState({error: err, files: EMPTY_MAP});
        return;
      }

      this.fetchFiles(props.onLoad);

      this.watcher = fs.watch(props.src, () => {
        this.fetchFiles();
      });

      this.watcher.on('error', err => {
        this.setState({error: err, files: EMPTY_MAP});
        this.removeWatcher();
      });
    });
  }

  removeWatcher() {
    if (this.watcher) {
      this.watcher.close();
    }
  }

  render() {
    const {error, files} = this.state;
    const {onError, onFiles} = this.props;
    if (error && onError) {
      return onError(error);
    } else {
      return onFiles(Array.from(files.values()));
    }
  }
}
