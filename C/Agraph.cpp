#include <stdio.h>
#include <stdlib.h>

#define MaxSize 20
typedef char VertexType; // VertexType
typedef struct node //边表节点
{
  int adjvex; // 邻接点域
  struct node *next; // 指向下一个邻接点的指针域
} EdgeNode; // 若要表示边上信息，则应增加一个数据域info

typedef struct // 顶点表节点
{
  int in; //入度值
  VertexType vertex; 
  EdgeNode *firstedge; // 边表头指针
} VertexNode;

typedef VertexNode AdjList[MaxSize]; // AdjList 是邻接表类型
typedef struct
{
  AdjList adjlist; // 邻接表
  int n, e; // 顶点数和边数
} ALGraph; // 是以邻接表方式存储的图类型

//链队列
typedef struct Node
{
  int data;
  struct Node *next;
} QNode;

typedef struct
{
  QNode *front;
  QNode *rear;
} LQueue;

LQueue *Creat_LQueue()
{ //创建一个链队列
  QNode *r = (QNode *)malloc(sizeof(QNode));
  LQueue *s = (LQueue *)malloc(sizeof(LQueue));
  r->next = NULL;
  s->front = s->rear = r;
  return s;
}
void InQueue(LQueue *s, int x)
{ //入队列
  QNode *r;
  r = (QNode *)malloc(sizeof(QNode));
  r->data = x;
  r->next = NULL;
  s->rear->next = r;
  s->rear = r;
}

int Empty_LQueue(LQueue *s)
{ //判断队列是否为空
  if (s->front == s->rear)
    return 1;
  else
    return 0;
}

int Out_LQueue(LQueue *s)
{ //出队列
  int x;
  QNode *r;
  if (Empty_LQueue(s) == 1)
    return 0;
  else
  {
    r = s->front->next;
    s->front->next = r->next;
    x = r->data;
    free(r);
    if (s->front->next == NULL)
      s->rear = s->front;
    return x;
  }
}

void Creat(ALGraph *G)
{ //以邻接表的形式创建有向图
  int i, j, k;
  EdgeNode *s;
  printf("读入定点数和边数");
  scanf("%d,%d", &G->n, &G->e);

  for (i = 0; i < G->n; i++)
  {
    fflush(stdin);
    printf("建立顶点表");
    G->adjlist[i].vertex = getchar();
    G->adjlist[i].firstedge = NULL;
  }
  printf("建立边表\n");
  for (k = 0; k < G->e; k++)
  {
    printf("读入(vi-vj)顶点对应序号");
    scanf("%d,%d", &i, &j);
    s = (EdgeNode *)malloc(sizeof(EdgeNode));
    s->adjvex = j;
    s->next = G->adjlist[i].firstedge;
    G->adjlist[i].firstedge = s;
  }
  for (i = 0; i < G->n; i++)
  {
    printf("请输入%d入度数:", i);
    scanf("%d", &G->adjlist[i].in);
  }
}
void print(ALGraph *G)
{ //以邻接表的形式输出有向图
  int i;
  for (i = 0; i < G->n; i++)
  {
    printf("%d->", i);
    while (G->adjlist[i].firstedge != NULL)
    {
      printf("%d->", G->adjlist[i].firstedge->adjvex);
      G->adjlist[i].firstedge = G->adjlist[i].firstedge->next;
    }
    printf("\n");
  }
}
void TopoSort(ALGraph *G)
{
  LQueue *Q;
  int i, j;
  EdgeNode *p;
  Q = Creat_LQueue();
  for (i = 0; i < G->n; i++)
  {
    if (G->adjlist[i].in == 0)
    {
      InQueue(Q, i);
    }
  }
  while (Empty_LQueue(Q) != 1)
  {
    printf("%d ", Out_LQueue(Q));
    for (i = 0; i < G->n; i++)
    {
      p = G->adjlist[i].firstedge;
      while (p != NULL)
      {
        j = p->adjvex;
        G->adjlist[j].in--;
        if (G->adjlist[j].in == 0)
          InQueue(Q, j);
        p = p->next;
      }
    }
  }
}
void main()
{
  ALGraph *G;
  printf("--------------------开始创建图----------------------------\n");
  G = (ALGraph *)malloc(sizeof(ALGraph));
  Creat(G);
  printf("---------------以邻接表的形式输出图----------------------\n");
  print(G);
  printf("-------------------实现拓扑排序---------------------------\n");
  TopoSort(G);
}
