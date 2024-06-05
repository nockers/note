import { useMutation } from "@tanstack/react-query"
import type { Api } from "api/route"
import { type InferResponseType, hc } from "hono/client"
import { Trash2, ArchiveRestore, Bookmark } from "lucide-react"
import { useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

type Props = {
  uuid: string
  text: string
  isBookmarked: boolean
  isArchived: boolean
  onRefetch(): void
}

const client = hc<Api>("/")

export function NoteCard(props: Props) {
  const mutation = useMutation({
    async mutationFn() {
      const resp = await client.api.posts[":post_id"].$delete({
        param: { post_id: props.uuid },
      })
      return await resp.json()
    },
  })

  const bookmarkMutation = useMutation<
    InferResponseType<
      (typeof client.api.posts)[":post_id"]["bookmarks"]["$post"]
    >,
    Error
  >({
    async mutationFn() {
      const resp = await client.api.posts[":post_id"].bookmarks.$post({
        param: { post_id: props.uuid },
        json: { user_id: 1 },
      })
      return await resp.json()
    },
  })

  const archiveMutation = useMutation<
    InferResponseType<(typeof client.api.posts)[":post_id"]["archive"]["$put"]>,
    Error
  >({
    async mutationFn() {
      const resp = await client.api.posts[":post_id"].archive.$put({
        param: { post_id: props.uuid },
      })
      return await resp.json()
    },
  })

  const onDelete = async () => {
    await mutation.mutateAsync()
    props.onRefetch()
  }

  const [isBookmarked, setBookmarked] = useState(props.isBookmarked)

  const onBookmark = async () => {
    setBookmarked(!isBookmarked)
    await bookmarkMutation.mutateAsync()
    props.onRefetch()
  }

  const onArchive = async () => {
    await archiveMutation.mutateAsync()
    props.onRefetch()
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-end">
          <Button
            className="rounded-full"
            variant={"secondary"}
            size={"icon"}
            onClick={() => {
              onBookmark()
            }}
          >
            {isBookmarked ? (
              <Bookmark className="w-4" fill="black" />
            ) : (
              <Bookmark className="w-4" />
            )}
          </Button>
        </div>
        <p>{props.text}</p>
        <div className="flex flex-wrap gap-1">
          <Badge>{"タグ"}</Badge>
          <Badge>{"タグ"}</Badge>
        </div>
        <div className="flex justify-end">
          {props.isArchived === false && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-full"
                    variant={"secondary"}
                    size={"icon"}
                    onClick={() => {
                      onArchive()
                    }}
                  >
                    <ArchiveRestore className="w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{"メモをアーカイブする"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button
            className="rounded-full"
            variant={"secondary"}
            size={"icon"}
            onClick={() => {
              onDelete()
            }}
          >
            <Trash2 className="w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
