/**
 * @packageDocumentation
 * @module Decorators
 */

import {makeJacksonDecorator} from '../util';
import 'reflect-metadata';
import {JsonUnwrappedDecorator, JsonUnwrappedOptions} from '../@types';
import {JsonUnwrappedPrivateOptions} from '../@types/private';

/**
 * Decorator used to indicate that a property should be serialized "unwrapped";
 * that is, if it would be serialized as JSON Object, its properties are
 * instead included as properties of its containing Object.
 *
 * It cannot be applied on Iterables and in conjunction of {@link JsonTypeInfo} as it requires use of type information.
 *
 * @example
 * ```typescript
 * class User {
 *   @JsonProperty()
 *   id: number;
 *   @JsonProperty()
 *   @JsonUnwrapped()
 *   @JsonClass({class: () => [Name]})
 *   name: Name;
 * }
 *
 * class Name {
 *   @JsonProperty()
 *   first: string;
 *   @JsonProperty()
 *   last: string;
 * }
 * ```
 */
export const JsonUnwrapped: JsonUnwrappedDecorator = makeJacksonDecorator(
  (o: JsonUnwrappedOptions = {}): JsonUnwrappedOptions => ({
    enabled: true,
    prefix: '',
    suffix: '',
    ...o
  }),
  (options: JsonUnwrappedOptions, target, propertyKey, descriptorOrParamIndex) => {
    const privateOptions: JsonUnwrappedPrivateOptions = {
      descriptor: (typeof descriptorOrParamIndex !== 'number') ? descriptorOrParamIndex : null,
      ...options
    };

    if (propertyKey != null) {
      Reflect.defineMetadata('jackson:JsonUnwrapped', privateOptions, target.constructor, propertyKey);
      Reflect.defineMetadata('jackson:JsonUnwrapped:' + propertyKey.toString(), privateOptions, target.constructor);
    }
  });