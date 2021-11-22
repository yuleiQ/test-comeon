#include <stdio.h>
#include <stdlib.h>

#define m 100

typedef struct //定义栈
{
  char data[m];
  int top;
} zhan;

void cshz(zhan *s) //初始化栈
{
  s->top = 0;
}

int pdzk(zhan *s) //判断栈是否为空
{
  if (s->top == 0)
  {
    return 0;
  }
  else
  {
    return 1;
  }
}

void ruzhan(zhan *s, char x) //入栈
{
  if (s->top == m)
  {
    printf("栈空\n");
  }
  else
  {
    s->data[++s->top] = x;
  }
}

char chuzhan(zhan *s) //出栈
{
  char y;
  if (s->top == 0)

  {
    printf("栈空\n");
    return '0';
  }
  else
  {
    y = s->data[s->top];
    s->top = s->top - 1;
    return y;
  }
}

typedef struct
{ //定义队列
  char data[m];
  int front;
  int rear;
} dui;

void cshdl(dui *q) //初始化队列
{
  q->front = q->rear = 0;
}

void rudui(dui *q, char e) //入队
{
  if ((q->rear + 1) % m == q->front)
  {
    printf("队列为空\n");
  }
  else
  {
    q->data[q->rear] = e;
    q->rear = (q->rear + 1);
  }
}

char chudui(dui *q) //出队
{
  char f;
  if (q->front == q->rear)
  {
    printf("队列为空\n");
    return 0;
  }
  else
  {
    f = q->data[q->front];
    q->front = (q->front + 1);
    return f;
  }
}

int main()
{
  char c;
  int y = 0;
  zhan *s = (zhan *)malloc(sizeof(zhan));
  dui *q = (dui *)malloc(sizeof(dui));
  cshz(s);
  cshdl(q);
  printf("输入一个字符串:\n");
  while ((c = getchar()) != '@')
  {
    ruzhan(s, c);
    rudui(q, c);
  }
  while (pdzk(s))
  {
    if (chuzhan(s) == chudui(q))
    {
      y = 1;
      continue;
    }
    else
    {
      y = 0;
      break;
    }
  }
  if (y == 1)
    printf("此字符串为回文\n");
  else
    printf("此字符串不是回文\n");
  return 0;
}
