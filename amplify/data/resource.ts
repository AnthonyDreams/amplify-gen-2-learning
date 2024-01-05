// backend/data/resource.ts

import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  TemplateDesigns: a
    .model({
      name: a.string().required(),
      content: a.json(),
      slug: a.string().required()
    })
    .authorization([a.allow.private()]),
  Workspace: a.model({
    name: a.string().required(),
    mantainers: a.string().array(),
    members: a.manyToMany('Member', { relationName: "WorkspaceMembers" })
  }).authorization([
    a.allow.owner().identityClaim("custom:workspace").inField('id').to(["read"]),
    a.allow.multipleOwners().inField('mantainers'),
    a.allow.private().to(["read"])
  ]),
  Member: a.model({
    workspaces: a.manyToMany('Workspace', { relationName: "WorkspaceMembers" })
  }).authorization([a.allow.private()]),
  Template: a.model({
    name: a.string().required(),
    content: a.json(),
    slug: a.string().required(),
    workspace: a.hasOne('Workspace'),
    ownerWorkspaceId: a.string().required()
  }).authorization([
    a.allow.owner().identityClaim("custom:workspace").inField('ownerWorkspaceId'),
    a.allow.private().to(['create'])
  ])
});


// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({ schema, authorizationModes: {
    defaultAuthorizationMode: "userPool"
} });