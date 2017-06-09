import React from 'react';
import { mapPropsStreamWithConfig } from 'recompose';
import mostConfig from 'recompose/mostObservableConfig';
import axios from 'axios';
import { create } from '@most/create';
import * as most from 'most';
import { last, uniq } from 'ramda';

const fetchSVGContent = (src) => axios.get(src);

const fromColdPromise = (f) => create((add, end, error) => {
  const promise = f();

  promise.then((data) => {
    add(data);
    end();
  }, error);
});

export default mapPropsStreamWithConfig(mostConfig)(
  (props$) => {
    const sources$ = props$
      .map((props) => props.src)

    const uniqSrc$ = sources$
      .scan((sources, src) => {
        // @TODO: Speed up this function
        // as otherwise we constantly having to loop
        // over the whole array.
        // I'd rather just check to see if the new item
        // even has to go in.
        return uniq([...sources, src]);
      }, [])
      .map(last)
      .skipRepeats();

    const src$ = uniqSrc$
      .map((src) => {
        return fromColdPromise(() => fetchSVGContent(src))
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
