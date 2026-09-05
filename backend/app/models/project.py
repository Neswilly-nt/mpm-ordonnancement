from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


task_dependencies = Table(
    "task_dependencies",
    Base.metadata,
    Column("predecessor_id", ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True),
    Column("successor_id", ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True),
)


class Project(Base):
    __tablename__ = "projects"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(String(500), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    tasks: Mapped[list["Task"]] = relationship(back_populates="project", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(80))
    duration: Mapped[float] = mapped_column(Float)
    project: Mapped[Project] = relationship(back_populates="tasks")
    predecessors: Mapped[list["Task"]] = relationship(
        secondary=task_dependencies,
        primaryjoin=id == task_dependencies.c.successor_id,
        secondaryjoin=id == task_dependencies.c.predecessor_id,
    )

