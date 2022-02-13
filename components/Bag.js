import React from 'react';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';

export default function Bag() {
  const colorState = useSelector(state => state.theme.theme.value.colors);
  
  const xml = `
  <svg width="385" height="418" viewBox="0 0 385 418" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M164.864 411.376C164.864 426.251 380 334.781 380 307.245C380 279.709 380 115.127 
  380 79.9948C380 44.8629 339.689 15.1268 314.536 15.1268M164.864 411.376C164.864 364.216 164.864 
  172.731 164.864 125.571C164.864 78.4122 195.914 52.7754 215.875 41.0647C235.837 29.354 289.383 15.1268 314.536 
  15.1268M164.864 411.376C164.864 419.885 72.1508 379.108 72.1508 357.586C72.1508 351.951 72.1508 337.032 72.1508 
  317.337M314.536 15.1268C314.536 15.1268 241.243 5 215.875 5C190.508 5 174.808 11.329 136.47 23.6738C123.713 27.7815 
  107.094 44.5833 97.5754 56.9068M235.203 142.031L329.939 112.913M97.5754 56.9068C93.389 63.2519 89.6486 70.1364 86.4086 
  77.2894C84.8349 80.7636 82.8855 86.2003 81.5541 89.7701M97.5754 56.9068C95.763 59.2533 99.2488 54.3706 97.5754 56.9068ZM97.5754 
  56.9068C97.5754 56.9068 61.5928 60.9682 49.5529 65.3993C37.5131 69.8303 16.9181 80.275 9.63075 107.494C2.34337 134.714 3.92772 248.339 
  12.4825 272.71C21.0372 297.081 72.1508 317.337 72.1508 317.337M72.1508 317.337C72.1508 312.269 72.1508 306.884 72.1508 301.26C72.1508 299.608 
  72.1508 294.289 72.1508 288.954M81.5541 89.7701C75.1831 106.852 72.1508 122.774 72.1508 137.932C72.1509 163.906 72.1509 221.481 72.1508 276.561C72.1508
   278.286 72.1508 283.628 72.1508 288.954M81.5541 89.7701C81.5541 89.7701 69.1972 91.0362 60.009 94.8342C50.8207 98.6323 46.0677 104.331 40.6815 116.99C38.0049
    123.28 36.7365 156.448 36.9933 189.786C37.2533 223.532 39.0759 257.452 42.5824 263.848C49.5529 276.561 72.1508 288.954 72.1508 288.954M321.384 118.293C315.364
     121.142 326.454 138.866 329.939 142.031C333.424 145.196 341.345 142.664 341.345 137.6C341.345 132.536 327.404 115.445 321.384 118.293ZM215.875 249.959L347.999
      204.383V300.6L215.875 355.988V249.959Z" stroke="${colorState.text}" stroke-width="10" stroke-linecap="round"/>
  </svg>
  
  `
  return (
    <SvgXml xml={xml} width="50%" height="100%" />
  )
}