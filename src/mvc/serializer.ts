import { NotImplementFailure } from "../errors/failure";


type NullType = {} | null | undefined
type SingleOrArrayType<TConfident, TUnit> = TConfident extends Array<any> ? Array<TUnit> : TUnit | NullType

export abstract class Serializer<TSource=object, TTarget=object> {
  serialize (source?: TSource | NullType | Array<TSource | NullType>)
    :  SingleOrArrayType<typeof source, TTarget>
  {
    if (source === undefined || source === null) return source;
    if (source instanceof Array) {
      return source.map(v => this.serialize(v))
    }
    if (Object.keys(source).length === 0) {
      // 值为 {}
      return source
    }
    return this.doSerialize(source as TSource)
  }

  doSerialize (source: TSource): TTarget {
    throw new NotImplementFailure()
  }
}
