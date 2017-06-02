import React from 'react';
import { mapPropsStreamWithConfig } from 'recompose';
import mostConfig from 'recompose/mostObservableConfig';
import axios from 'axios';
import { create } from '@most/create';
import * as most from 'most';

const fetchSVGContent = (src) => axios.get(src);

const fromColdPromise = (f) => create((add, end, err) => {
  const promise = f();

  return promise.then((data) => {
    add(data);
    end();
  }, error);
});

export default mapPropsStreamWithConfig(mostConfig)(
  (props$) => {
    const src$ = props$
      .map((props) => props.src)
      .skipRepeats()
      .map((src) => {
        return fromColdPromise(() => fetchSVGContent(props.src))
          .map((response) => response.data);
      })
      .switchLatest();

    return most.combine(
      (props, src) => {
        return {
          ...props,
          src,
        };
      },
      props$,
      src$,
    );
  },
);
