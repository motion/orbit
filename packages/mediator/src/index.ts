export * from "./client"
export * from "./common"
export * from "./server"
export * from "./typeorm-extension"
// library


////////////////////////////////////////////
// interfaces and shared declarations (the only shared code)

/*export interface Photo {
  id: number;
  filename: string;
}

export interface Category {
  id: number;
  name: string;
  posts?: Post[];
}

export interface Post {
  id: number;
  title: string;
  photo: Photo;
  categories?: Category[];
}

export interface PostArgs {
  limit: number;
}

export interface PostChangeCommandArgs {
  limit: number;
}


export const PostModel = new Model<Post, PostArgs>("Post");
export const CategoryModel = new Model<Category>("Category");
export const PhotoModel = new Model<Photo>("Photo");*/

// client example

// export const mediator = new Mediator({
//   transport: new WebSocketClientTransport()
// });
//
// async () => {
//   const postFromCommand = await mediator.command(PostChangeCommand, {
//     limit: 1
//   });
//
//   const postFromQuery = await mediator.loadOne(query(PostModel, {
//     id: true,
//     title: true,
//     categories: {
//       id: true
//     }
//   }));
//
//   const postsFromQuery = await mediator.loadMany(query(PostModel, {
//     id: true,
//     title: true,
//     categories: {
//       id: true
//     }
//   }));
//
//   await mediator.save(PostModel, {
//     id: 1,
//     title: "hello world"
//   });
//
//   await mediator.remove(PostModel, { id: 1 });
//
//   const subscription = await mediator.subscribeOne(query(PostModel, {
//     id: true,
//     title: true,
//     categories: {
//       id: true
//     }
//   })).subscribe(post => {
//   });
// };


// server example

/* export const PostChangeCommandResolver = resolveCommand(PostChangeCommand, async args => {
  return {
    id: 1
  };
});

export const PostModelResolver = resolveOne(PostModel, async args => {
  return {
    id: 1
  };
});

export const PostModelManyResolver = resolveMany(PostModel, async args => {
  return [{
    id: 1
  }];
});

export const PostModelSaveResolver = resolveSave(PostModel, async model => {
  return model;
});

export const PostModelRemoveResolver = resolveRemove(PostModel, async model => {
  return true;
});

export const PostCategoriesResolver = resolveModelProperty(PostModel, "categories", async args => {
  return [{
    id: 1,
    name: "Hello"
  }];
}); */