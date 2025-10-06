declare module 'replicate' {
  interface ReplicateOptions {
    auth?: string
  }

  class Replicate {
    constructor(options?: ReplicateOptions)
    // run returns any because Replicate responses vary by model
    run(model: string, opts?: { input?: any }): Promise<any>
  }

  export default Replicate
}
