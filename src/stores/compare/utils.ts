import type {Movie} from '../../types.ts';

export const isCompared = (compare: Movie[], id: number): boolean => {
  return compare.some((movie) => movie.id === id)
};