import React from 'react'

declare global {
  // Allow JSX in TS files without importing React in every file
  namespace JSX {
    interface IntrinsicElements {
      // allow any element
      [elemName: string]: any
    }
  }
}

export {}
